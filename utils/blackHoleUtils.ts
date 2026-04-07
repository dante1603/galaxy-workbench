
import * as THREE from 'three';

/**
 * Vertex Shader for the Black Hole.
 * Standard projection, passes world position to fragment for raymarching.
 */
export const BH_VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vLocalPosition;

void main() {
  vUv = uv;
  vLocalPosition = position;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

/**
 * Fragment Shader for the Black Hole.
 * Includes:
 * 1. Analytic Ray-Sphere Intersection (Space Skipping)
 * 2. Raymarching with Gravity Bending
 * 3. Accretion Disk with Doppler Shift & Noise
 * 4. Transparency support
 */
export const BH_FRAGMENT_SHADER = `
uniform float uTime;
uniform vec3 uColor; // User Selected Accretion Color
uniform float uDiskRadius;
uniform float uBlackHoleRadius;
uniform vec3 uCameraPos;
uniform float uOpacity;

varying vec3 vLocalPosition;

// --- 3D NOISE FUNCTIONS ---
float hash(vec3 p) {
    return fract(sin(dot(p, vec3(12.9898, 78.233, 148.85))) * 43758.5453);
}

float noise(in vec3 x) {
    vec3 i = floor(x);
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                    mix( hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                mix(mix( hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                    mix( hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

// FBM for Accretion Disk
float fbm(vec3 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 4; i++) { // Reduced octaves for performance
        v += a * noise(p);
        p *= 2.0;
        a *= 0.5;
    }
    return v;
}

void main() {
    vec3 ro = uCameraPos;
    vec3 rd = normalize(vLocalPosition - ro);
    
    // Use a tighter simulation radius to skip empty space
    float simRadius = uDiskRadius * 1.5; 
    
    // Analytic Ray-Sphere Intersection
    float b = dot(ro, rd);
    float c = dot(ro, ro) - simRadius * simRadius;
    float h = b*b - c;
    
    // If ray misses the simulation sphere, fully transparent
    if (h < 0.0) {
        discard;
        return;
    }
    
    vec3 pos = ro;
    vec3 dir = rd;
    
    // Space Skipping: Move ray start to the sphere surface if outside
    float dstToSphere = -b - sqrt(h);
    if (dstToSphere > 0.0) {
        pos = ro + rd * dstToSphere;
    }

    // --- RAYMARCHING ---
    const int STEPS = 128; 
    float STEP_SIZE = (simRadius * 2.0) / float(STEPS); 
    
    vec3 col = vec3(0.0);
    float density = 0.0;
    bool hitHorizon = false;
    float time = uTime * 1.5;
    
    for(int i = 0; i < STEPS; i++) {
        float r = length(pos);
        
        // 1. EVENT HORIZON (The Black Void)
        if (r < uBlackHoleRadius) {
            hitHorizon = true;
            break;
        }
        
        // 2. GRAVITY BENDING (Simple approximate)
        float distSq = dot(pos, pos);
        vec3 toCenter = normalize(-pos);
        float force = (0.8 * uBlackHoleRadius) / (distSq + 0.01); 
        dir = normalize(dir + toCenter * force * STEP_SIZE); 
        
        // 3. ACCRETION DISK
        float h_disk = abs(pos.y);
        float thickness = 0.15 + (r * 0.1);
        
        if (h_disk < thickness && r > uBlackHoleRadius * 1.1 && r < uDiskRadius) {
            float radialDensity = 1.0 - smoothstep(uBlackHoleRadius * 1.2, uDiskRadius, r);
            float verticalDensity = 1.0 - (h_disk / thickness);
            
            // Rotating Noise
            float angle = atan(pos.z, pos.x);
            float noiseVal = fbm(vec3(r * 3.0, angle * 2.0 + time * (4.0/(r+0.1)), pos.y * 8.0));
            
            // Doppler Shift Logic
            vec3 vel = normalize(vec3(-pos.z, 0.0, pos.x)); // Tangent velocity
            float doppler = dot(normalize(dir), vel); 
            float shift = smoothstep(-1.0, 1.0, doppler);
            
            vec3 shiftColor;
            if (doppler > 0.0) {
                 // Blueshift (Approaching)
                 shiftColor = mix(uColor, vec3(0.9, 0.95, 1.0), doppler * 0.5);
            } else {
                 // Redshift (Receding)
                 shiftColor = mix(uColor, vec3(0.2, 0.05, 0.05), abs(doppler) * 0.8);
            }

            float beamIntensity = 0.5 + 1.5 * shift; 
            float stepDensity = radialDensity * verticalDensity * (noiseVal * 0.8 + 0.2) * 0.5;
            
            // Accumulate color and density
            col += shiftColor * stepDensity * beamIntensity;
            density += stepDensity;
            
            if(density > 1.0) break;
        }
        
        pos += dir * STEP_SIZE;
        
        // Exit optimization if we leave the volume (add epsilon to prevent early exit at start)
        if (i > 0 && r > simRadius + 0.1) break;
    }
    
    // 4. COMPOSITION
    // Output Alpha logic for transparency
    float alpha = density;
    
    // Gravitational Lensing "Halo" (Subtle distortion glow around the hole)
    // Since we can't refract the real background easily, we add a faint "energy haze"
    if (!hitHorizon && alpha < 0.1) {
        float distFromCenter = length(cross(ro, rd)); // Distance from ray to center (approx)
        float halo = 1.0 - smoothstep(uBlackHoleRadius, uDiskRadius * 1.5, distFromCenter);
        col += uColor * halo * 0.1;
        alpha += halo * 0.1;
    }

    if (hitHorizon) {
        // The hole itself is fully opaque black
        gl_FragColor = vec4(0.0, 0.0, 0.0, uOpacity);
    } else {
        // The disk blends additively usually, but here we mix
        // Output transparency so stars behind are visible
        gl_FragColor = vec4(col, alpha * uOpacity);
    }
}
`;

/**
 * Helper to create the ShaderMaterial for the Black Hole.
 */
export const createBlackHoleMaterial = (
    colorHex: string, 
    diskRadius: number, 
    coreRadius: number
): THREE.ShaderMaterial => {
    return new THREE.ShaderMaterial({
        uniforms: {
            uTime: { value: 0 },
            uColor: { value: new THREE.Color(colorHex) },
            uDiskRadius: { value: diskRadius },
            uBlackHoleRadius: { value: coreRadius },
            uCameraPos: { value: new THREE.Vector3() },
            uOpacity: { value: 1.0 },
        },
        vertexShader: BH_VERTEX_SHADER,
        fragmentShader: BH_FRAGMENT_SHADER,
        transparent: true,
        side: THREE.FrontSide,
        blending: THREE.NormalBlending,
        depthWrite: false
    });
};

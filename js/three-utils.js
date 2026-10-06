/* =====================================================================
   three-utils.js — peças 3D básicas reaproveitadas por todo o app
   (geometrias compartilhadas, material, elipsoide, segmento, sombra)
   ===================================================================== */

let GEO = null;   // criadas em initGeometries(), depois que o Three.js carregou
let V3 = null;
let UP = null;

function initGeometries() {
  V3 = THREE.Vector3;
  UP = new V3(0, 1, 0);
  // Poucos polígonos e reaproveitadas: bom para iPad antigo
  GEO = {
    sphere: new THREE.SphereGeometry(1, 16, 12),
    sphereLo: new THREE.SphereGeometry(1, 10, 8),
    cyl: new THREE.CylinderGeometry(1, 1, 1, 7, 1, true),
    cone: new THREE.ConeGeometry(1, 1, 6)
  };
}

// Material brilhante de inseto; guarda a cor original para "Conte as partes"
function mat(color, opts) {
  const m = new THREE.MeshPhongMaterial(Object.assign({
    color: new THREE.Color(color), shininess: 40, specular: 0x3a3a3a
  }, opts || {}));
  m.userData.base = m.color.clone();
  return m;
}

// Elipsoide com dimensões totais (comprimento, altura, largura)
function ellipsoid(m, l, h, w, geo) {
  const mesh = new THREE.Mesh(geo || GEO.sphere, m);
  mesh.scale.set(l / 2, h / 2, w / 2);
  return mesh;
}

// Cilindro ligando dois pontos + "junta" redonda no fim (pernas e antenas)
function segment(parent, a, b, r, m) {
  const d = new V3().subVectors(b, a);
  const len = d.length();
  const mesh = new THREE.Mesh(GEO.cyl, m);
  mesh.position.copy(a).addScaledVector(d, 0.5);
  mesh.scale.set(r, len, r);
  mesh.quaternion.setFromUnitVectors(UP, d.normalize());
  parent.add(mesh);
  const j = new THREE.Mesh(GEO.sphereLo, m);
  j.position.copy(b);
  j.scale.setScalar(r * 1.25);
  parent.add(j);
  return mesh;
}

// Sombra falsa (textura degradê): muito mais leve que sombras reais
let blobTexture = null;
function blobShadow(l, w) {
  if (!blobTexture) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const g = c.getContext('2d');
    const gr = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    gr.addColorStop(0, 'rgba(60,35,15,.45)');
    gr.addColorStop(1, 'rgba(60,35,15,0)');
    g.fillStyle = gr;
    g.fillRect(0, 0, 64, 64);
    blobTexture = new THREE.CanvasTexture(c);
  }
  const m = new THREE.Mesh(new THREE.PlaneGeometry(l, w),
    new THREE.MeshBasicMaterial({ map: blobTexture, transparent: true, depthWrite: false }));
  m.rotation.x = -Math.PI / 2;
  m.position.y = 0.003;
  m.renderOrder = -1;
  return m;
}

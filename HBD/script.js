const canvas = document.getElementById('sakura'); // ดึง <canvas> จาก HTML ที่มี id='sakura'
const ctx = canvas.getContext('2d'); // ตั้ง context เป็น 2D เพื่อวาดภาพบน canvas

// ฟังก์ชันปรับขนาด canvas ให้เต็มหน้าจอ
function resizeCanvas() {
  canvas.width = window.innerWidth; // กำหนดความกว้าง canvas = ความกว้างหน้าจอ
  canvas.height = window.innerHeight; // กำหนดความสูง canvas = ความสูงหน้าจอ
}
resizeCanvas(); // เรียกใช้ตอนโหลดหน้าเว็บครั้งแรก
window.addEventListener('resize', resizeCanvas); // ถ้าหน้าจอเปลี่ยนขนาด (resize) ให้เรียกใช้ฟังก์ชันนี้เพื่อปรับ canvas ตาม

// สร้างคลาส Petal (กลีบซากุระ)
class Petal {
  constructor() {
    this.reset(); // เริ่มต้นค่าต่างๆของกลีบเมื่อสร้างใหม่
  }

  reset() {
    // กำหนดตำแหน่งเริ่มต้น x เป็นตำแหน่งสุ่มในความกว้างของ canvas
    this.x = Math.random() * canvas.width;
    // ตำแหน่ง y เริ่มนอกหน้าจอด้านบน (ลบค่า canvas.height เพื่อให้กลีบเริ่มจากบนสุดลอยลงมา)
    this.y = Math.random() * -canvas.height;
    this.size = Math.random() * 10 + 8; // ขนาดกลีบ (8 - 18 px)
    this.speedY = Math.random() * 2 + 1; // ความเร็วตกลงในแนวแกน y (1 - 3 px ต่อเฟรม)
    this.speedX = Math.random() * 1 - 0.5; // ความเร็วเลื่อนซ้ายขวา (จาก -0.5 ถึง +0.5 px ต่อเฟรม)
    this.rotation = Math.random() * 360; // มุมหมุนเริ่มต้นของกลีบ (0 - 360 องศา)
    this.rotationSpeed = Math.random() * 2 - 1; // ความเร็วหมุน (-1 ถึง +1 องศาต่อเฟรม)
    this.swing = Math.random() * 50; // ระยะการแกว่ง (ในที่นี้ไม่ได้ใช้จริงใน update)
    this.angle = Math.random() * Math.PI * 2; // มุมแกว่ง (0 - 2π)
    this.angleSpeed = Math.random() * 0.02 + 0.01; // ความเร็วเพิ่มมุมแกว่ง (0.01 - 0.03)
  }

  update() {
    this.y += this.speedY; // กลีบตกลงตามความเร็ว y
    // กลีบเลื่อนไปตามแกน x ตามความเร็ว x บวกกับการแกว่งซ้ายขวาตาม sine ของมุม angle
    this.x += this.speedX + Math.sin(this.angle) * 0.5;
    this.angle += this.angleSpeed; // เพิ่มมุมแกว่งทุกเฟรม (ทำให้แกว่งได้)
    this.rotation += this.rotationSpeed; // หมุนกลีบตามความเร็วหมุน

    // ถ้ากลีบตกเลยขอบล่างของ canvas แล้ว
    if (this.y > canvas.height + this.size) {
      this.reset(); // รีเซ็ตตำแหน่งและค่าทั้งหมดใหม่ (สุ่มใหม่)
      this.y = -this.size; // เริ่มจากบนหน้าจอ (ขอบบน)
    }
  }

  draw() {
    ctx.save(); // เก็บสถานะการวาดก่อนหน้าไว้ เพื่อจะได้กลับมาหลังวาดเสร็จ
    ctx.translate(this.x, this.y); // เลื่อนจุดอ้างอิงไปที่ตำแหน่งกลีบ
    ctx.rotate(this.rotation * Math.PI / 180); // หมุนกลีบตามมุม rotation (แปลงเป็นเรเดียน)

    // สร้าง gradient สีแบบวงกลมตรงกลางกลีบไล่ไปขอบ
    const gradient = ctx.createRadialGradient(0, 0, this.size / 10, 0, 0, this.size);
    gradient.addColorStop(0, '#ffb7c5'); // สีชมพูเข้มตรงกลางกลีบ
    gradient.addColorStop(0.5, '#ffd6e0'); // สีชมพูอ่อนไล่กลาง
    gradient.addColorStop(1, '#fff0f5'); // สีชมพูขอบสุด (แทบขาว)

    ctx.fillStyle = gradient; // ใช้ gradient ที่สร้างเป็นสีเติม
    ctx.beginPath();
    // วาดวงรี (ellipse) กว้าง = size, สูง = size/2, หมุน 45 องศา (Math.PI/4)
    ctx.ellipse(0, 0, this.size, this.size / 2, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill(); // เติมสี

    ctx.restore(); // คืนสถานะการวาดกลับไปก่อน translate และ rotate
  }
}

// สร้างกลีบซากุระจำนวน 60 กลีบเก็บใน array
const petals = [];
for (let i = 0; i < 60; i++) {
  petals.push(new Petal());
}

// ฟังก์ชันหลักสำหรับการเคลื่อนไหวและวาดซ้ำๆ (animation loop)
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // เคลียร์พื้นที่วาดก่อนวาดใหม่ทุกเฟรม
  petals.forEach(petal => {
    petal.update(); // อัพเดตตำแหน่งและสถานะของกลีบแต่ละอัน
    petal.draw();   // วาดกลีบนั้น
  });
  requestAnimationFrame(animate); // เรียกใช้ animate อีกครั้งในเฟรมถัดไป (smooth animation)
}

animate(); // เริ่มต้นการวาดกลีบตกลงมา

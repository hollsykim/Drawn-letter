window.addEventListener('DOMContentLoaded', () => {
  // ==== 요소 캐시 ====
  const canvas = document.getElementById('postcardCanvas');
  const ctx = canvas.getContext('2d');
  const bgColorInput = document.getElementById('bgColor');
  const textColorInput = document.getElementById('textColor');
  const stampDateInput = document.getElementById('stampDate');
  const stampTextInput = document.getElementById('stampText');
  const stampBtn = document.getElementById('stampBtn');
  const backToDrawingBtn = document.getElementById('backToDrawingBtn');
  const saveJpgBtn = document.getElementById('saveJpgBtn');
  const savePngBtn = document.getElementById('savePngBtn');

  // ==== flatpickr 초기화 ====
  flatpickr(stampDateInput, {
    locale: 'en',
    dateFormat: 'm/d/Y',
  });

  // ==== QA 답변 불러오기 ====
  const savedAnswers = localStorage.getItem('qaAnswers');
  const answers = savedAnswers
    ? JSON.parse(savedAnswers)
    : { qa1: '', qa2: '', qa3: '', qa4: '' };

  // ==== 드로잉 이미지 로드 ====
  const imageData = localStorage.getItem('drawing');
  const img = new Image();
  img.onload = drawCanvas;
  if (imageData) {
    img.src = imageData;
  } else {
    alert('No drawing found. Please draw something first.');
  }

  // ==== 줄바꿈 헬퍼 ====
  function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    const words = text.split(' ');
    let line = '';
    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      if (ctx.measureText(testLine).width > maxWidth && n > 0) {
        ctx.fillText(line, x, y);
        line = words[n] + ' ';
        y += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, y);
  }

  // ==== 메인 그리기 함수 ====
  function drawCanvas() {
    // 1) 배경
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = bgColorInput.value;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2) 원본 드로잉
    if (img.complete) {
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    }

    // 3) QA 4분면 그리기
    const padding = 20;
    const lineHeight = 28;
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;

    ctx.save();
    ctx.font = 'bold 24px serif';
    ctx.fillStyle = textColorInput.value;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';

    wrapText(
      ctx,
      answers.qa1 || '',
      padding,
      padding,
      midX - padding * 2,
      lineHeight
    );
    wrapText(
      ctx,
      answers.qa2 || '',
      midX + padding,
      padding,
      midX - padding * 2,
      lineHeight
    );
    wrapText(
      ctx,
      answers.qa3 || '',
      padding,
      midY + padding,
      midX - padding * 2,
      lineHeight
    );
    wrapText(
      ctx,
      answers.qa4 || '',
      midX + padding,
      midY + padding,
      midX - padding * 2,
      lineHeight
    );

    ctx.restore();
  }

  // ==== 배경/글자색 변경 시 다시 그리기 ====
  bgColorInput.addEventListener('input', drawCanvas);
  textColorInput.addEventListener('input', drawCanvas);

  // ==== 초기 렌더 ====
  drawCanvas();

  // ==== Stamp 기능 (오른쪽 하단 사각 도장 + 텍스트/날짜) ====
  stampBtn.addEventListener('click', () => {
    const textVal = stampTextInput.value.trim() || '–';
    const rawDate = stampDateInput.value;
    const dateStr = rawDate
      ? new Date(rawDate).toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : '–';

    const w = 240,
      h = 120;
    const x = canvas.width - w - 20;
    const y = canvas.height - h - 20;
    const pad = 12;
    const midY = pad + 24;

    ctx.save();
    ctx.translate(x, y);
    ctx.strokeStyle = '#d32f2f';
    ctx.fillStyle = '#d32f2f';
    ctx.lineWidth = 2;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // 외곽 사각형
    ctx.strokeRect(0, 0, w, h);
    // 분할선
    ctx.beginPath();
    ctx.moveTo(0, midY);
    ctx.lineTo(w, midY);
    ctx.stroke();
    // 헤더
    ctx.font = '14px serif';
    ctx.fillText('drawn letter', pad, midY / 2);
    // Stamp Text
    ctx.fillText(textVal, pad, midY + pad);
    // Stamp Date
    ctx.fillText(dateStr, pad, midY + pad + 24);
    ctx.restore();
  });

  // ==== Back to Drawing ====
  backToDrawingBtn.addEventListener('click', () => {
    window.location.href = '/Drawn-letter/hand-draw/index.html';
  });

  // ==== Save as JPG ====
  saveJpgBtn.addEventListener('click', () => {
    console.log('👉 Saving JPG…');
    const link = document.createElement('a');
    link.download = 'postcard.jpg';
    link.href = canvas.toDataURL('image/jpeg', 0.95);
    link.click();
  });

  // ==== Save as PNG ====
  savePngBtn.addEventListener('click', () => {
    console.log('👉 Saving PNG…');
    const link = document.createElement('a');
    link.download = 'postcard.png';
    link.href = canvas.toDataURL('image/png');
    link.click();
  });
});

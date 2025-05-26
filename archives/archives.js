window.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('archiveGrid');
  const modal = document.getElementById('previewModal');
  const overlay = modal.querySelector('.overlay');
  const closeBtn = document.getElementById('closeModal');
  const previewImg = document.getElementById('previewImage');
  const previewText = document.getElementById('previewText');

  // 로컬스토리지에서 아카이브 불러오기
  const archives = JSON.parse(localStorage.getItem('postcardArchives') || '[]');

  if (archives.length === 0) {
    grid.innerHTML =
      '<p style="grid-column:1/-1; text-align:center;">아직 저장된 엽서가 없습니다.</p>';
    return;
  }

  // 카드 생성
  archives.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <img src="${item.image}" alt="Postcard ${idx + 1}"/>
        <div class="meta">${new Date(item.timestamp).toLocaleString()}</div>
      `;
    card.addEventListener('click', () => {
      // 미리보기 모달에 데이터 채우고 열기
      previewImg.src = item.image;
      previewText.textContent = Object.entries(item.answers)
        .map(([k, v]) => `${k.toUpperCase()}: ${v}`)
        .join('\n\n');
      modal.classList.remove('hidden');
    });
    grid.append(card);
  });

  // 모달 닫기
  [closeBtn, overlay].forEach((el) =>
    el.addEventListener('click', () => modal.classList.add('hidden'))
  );
});

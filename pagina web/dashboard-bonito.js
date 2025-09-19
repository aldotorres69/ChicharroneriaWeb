function scrollCards(containerId, direction) {
  const container = document.getElementById(containerId);
  const card = container.querySelector('.card');
  if(!card) return;
  const cardWidth = card.offsetWidth + 24; // +gap
  container.scrollBy({ left: direction * cardWidth, behavior: 'smooth' });
}
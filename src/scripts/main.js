document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search');
  const filterSelect = document.getElementById('categoryFilter');
  const resetButton = document.getElementById('resetFilters');
  const container = document.getElementById('categories-container');
  const resultMessage = document.getElementById('no-results');

  let allCategories = [];

  function createCategoryElement(cat) {
    const div = document.createElement('div');
    div.className = "bg-gray-800 rounded-xl p-6 shadow-lg transition transform hover:scale-105 hover:ring-2 hover:ring-orange-400";
    div.setAttribute('data-category', cat.category);

    div.innerHTML = `
      <img src="${cat.icon}" alt="${cat.title}" class="mx-auto mb-4">
      <h2 class="text-2xl font-bold text-center mb-4">${cat.title}</h2>
      <ul class="space-y-2 text-center">
        ${cat.links
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(link => `<li><a href="${link.url}" target="_blank" class="text-orange-400 hover:underline">${link.name}</a></li>`).join('')}
      </ul>
    `;

    return div;
  }

  function renderCategories(data) {
    container.innerHTML = '';
    const sorted = [...data].sort((a, b) => a.title.localeCompare(b.title));
    sorted.forEach(cat => container.appendChild(createCategoryElement(cat)));
  }

  function filterCategories() {
    const searchValue = searchInput.value.toLowerCase();
    const selectedCategory = filterSelect.value;
    let visibleCount = 0;

    const blocks = document.querySelectorAll('[data-category]');
    blocks.forEach(block => {
      const text = block.textContent.toLowerCase();
      const cat = block.dataset.category;
      const matchText = text.includes(searchValue);
      const matchCat = selectedCategory === 'all' || cat === selectedCategory;

      if (matchText && matchCat) {
        block.classList.remove('hidden');
        visibleCount++;
      } else {
        block.classList.add('hidden');
      }
    });

    resultMessage.classList.toggle('hidden', visibleCount > 0);
  }

  searchInput.addEventListener('input', filterCategories);
  filterSelect.addEventListener('change', filterCategories);
  resetButton.addEventListener('click', () => {
    searchInput.value = '';
    filterSelect.value = 'all';
    filterCategories();
  });

  fetch('data/links.json')
    .then(response => response.json())
    .then(data => {
      allCategories = data;

      const uniqueCategories = [...new Map(data.map(cat => [cat.category, cat.title])).entries()]
        .sort((a, b) => a[1].localeCompare(b[1]));

      for (let i = filterSelect.options.length - 1; i > 0; i--) {
        filterSelect.remove(i);
      }

      uniqueCategories.forEach(([value, title]) => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = title;
        filterSelect.appendChild(option);
      });

      renderCategories(allCategories);
      filterCategories();
    });
});

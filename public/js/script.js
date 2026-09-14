function selectCategory(button) {
	const categoryButtons = document.querySelectorAll('.category-button');

	categoryButtons.forEach((categoryButton) => {
		const isSelected = categoryButton === button;
		categoryButton.classList.toggle('selected', isSelected);
		categoryButton.setAttribute('aria-pressed', String(isSelected));
	});

	localStorage.setItem('selectedCategory', button.textContent.trim());
}

document.addEventListener('DOMContentLoaded', () => {
	const categoryButtons = document.querySelectorAll('.category-button');
	const savedCategory = localStorage.getItem('selectedCategory');

	categoryButtons.forEach((button) => {
		button.setAttribute('aria-pressed', String(button.textContent.trim() === savedCategory));
		button.addEventListener('click', () => selectCategory(button));
	});
});

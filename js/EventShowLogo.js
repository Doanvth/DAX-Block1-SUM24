document.addEventListener('DOMContentLoaded', function () {
    const showMoreButton = document.querySelector('.show-more-item');
    const hiddenItems = document.querySelectorAll('.item-hidden');
    const DontShowMoreButton = document.querySelector('.dont-show-more-item');
    showMoreButton.addEventListener('click', function () {
        hiddenItems.forEach(item => {
            item.classList.remove('item-hidden');
        });
        showMoreButton.style.display = 'none';
        DontShowMoreButton.style.display = 'flex';

    });
    DontShowMoreButton.addEventListener('click', function () {
        hiddenItems.forEach(item => {
            item.classList.add('item-hidden');
        });
        DontShowMoreButton.style.display = 'none';
        showMoreButton.style.display = 'flex';
    });
});

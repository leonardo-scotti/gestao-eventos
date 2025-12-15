function toggleMenu() {
    const btnMenu = document.getElementById('small-menu');
    const menu = document.getElementById('menu');

    btnMenu.addEventListener('click', (event) => {
        event.stopPropagation();
        toggleMenu();
    });

    function toggleMenu() {
        menu.classList.toggle('active');
    }

    document.addEventListener('click', (event) => {
        if (menu.classList.contains('active')) {

            if (!menu.contains(event.target) && !btnMenu.contains(event.target)) {
                menu.classList.remove('active');
            }
        }
    });
}

toggleMenu()
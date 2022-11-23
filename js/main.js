install_listeners = () => {
    // add listenerr to menu buttons
    document.getElementById('start-btn').addEventListener('click', () => {
        hide_menu();
        start_game();
    });

    document.getElementById('mute-btn').addEventListener('click', () => {
        var mute = document.getElementById('mute');
        mute.classList.toggle('active');
        if (mute.classList.contains('active')) {
            Howler.mute();
        } else {
            Howler.unmute();
        }
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
        hide_menu();
        start_game();
    });
    document.getElementById('menu-btn').addEventListener('click', () => {
        show_menu();
    });
    document.getElementById('settings-btn').addEventListener('click', () => {
        document.getElementById('settings').classList.toggle('active');
        document.getElementById('settings-menu').classList.toggle('active');
    });
}

hide_loader = () => {
    var loader = document.getElementById('loader-screen');
    loader.style.opacity = 0;
    setTimeout(() => {
        loader.style.display = 'none';
    }
        , 500);
}

show_loader = () => {
    var loader = document.getElementById('loader-screen');
    loader.style.display = 'flex';
    setTimeout(() => {
        loader.style.opacity = 1;
    }
        , 500);
}

function show_menu() {
    mode = 'menu';
    sounds.music.stop();
    var menu = document.getElementById('menu');
    menu.style.display = 'flex';
    menu.style.opacity = 1;
}

function hide_menu() {
    var menu = document.getElementById('menu');
    menu.style.opacity = 0;
    setTimeout(function () {
        menu.style.display = 'none';
    }, 600);
}

function change_border(color='var(--theme)') {
    document.getElementById('gameCanvas').style.borderColor = color;
}

window.onload = () => {
    install_listeners();
}
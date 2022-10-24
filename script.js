document.addEventListener('DOMContentLoaded', () => {
    let scrollToIndent = getScrollToIndent();
    const setActiveAsideLink = () => {
        let currentLink;

        asideLinks.forEach(asideLink => {
            const section = document.querySelector(`#${asideLink.dataset.section}`);
            const sectionTop = section.getBoundingClientRect().top;

            if (scrollToIndent >= sectionTop) {
                currentLink = asideLink;
            }
        });

        asideLinks.forEach(asideLink => {
            if (asideLink === currentLink) {
                asideLink.classList.add('aside-link-active');
                asideLink.parentElement.scrollIntoView();
            } else {
                asideLink.classList.remove('aside-link-active');
            }
        });
    };

    const scrollToSection = (id, openDetails = false) => {
        const section = document.querySelector(`#${id}`);

        if (openDetails) {
            section.querySelector('details').open = true;
        }

        const sectionTop = Math.ceil(section.getBoundingClientRect().top) + Math.ceil(scrollY) + 1 - scrollToIndent;

        window.scrollTo({ top: sectionTop });
    };
    const asideLinks = [...document.querySelectorAll('.aside-link')];

    asideLinks.forEach(asideLink => {
        asideLink.addEventListener('click', e => {
            e.preventDefault();
            scrollToSection(e.currentTarget.dataset.section);
        });
    });

    const productCards = [...document.querySelectorAll('.product-card')];
    const productDescriptions = [...document.querySelectorAll('.product-description')];
    const audio = document.querySelector('audio');
    let playSound = true;

    productCards.forEach(productCard => {
        productCard.addEventListener('click', () => {
            const productDescriptionId = productCard.dataset.productDescriptionId;

            if (productCard.classList.contains('shown-product')) {
                productCard.classList.remove('shown-product');
                productDescriptions.find(pd => pd.id === productDescriptionId).classList.remove('show-product-description');
                if (playSound) {
                    audio.pause();
                }
            } else {
                productCards.forEach(pc => {
                    if (pc === productCard) {
                        pc.classList.add('shown-product');
                    } else {
                        pc.classList.remove('shown-product');
                    }
                });

                productDescriptions.forEach(pd => {
                    if (pd.id === productDescriptionId) {
                        pd.classList.add('show-product-description');
                        if (playSound) {
                            audio.pause();
                            audio.currentTime = 0;
                            audio.play();
                        }
                    } else {
                        pd.classList.remove('show-product-description');
                    }
                });
            }
        });
    });

    if (audio) {
        document.querySelector('.sound').addEventListener('click', e => {
            e.currentTarget.textContent = playSound ? 'Увімкнути звук' : 'Вимкнути звук';
            playSound = !playSound;

            if (!playSound) {
                audio.pause();
            }
        });
    }

    document.addEventListener('scroll', () => {
        setActiveAsideLink();
    });

    // click to hash link from other page
    if (window.location.hash) {
        scrollToSection(window.location.href.split('#')[1], true);
        window.history.replaceState(null, '', window.location.pathname);
    }

    window.addEventListener('resize', () => {
        scrollToIndent = getScrollToIndent();
        setActiveAsideLink();
    });
});

const getScrollToIndent = () => window.innerWidth > 745 ? 100 : 150;

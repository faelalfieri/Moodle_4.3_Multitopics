
    window.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location.href);
        const hiddenSection = 5;

        // Evita redirecionamento em loop
        if (!url.searchParams.has('sectionid')) {
            if (!window.location.href.includes('__init')) {
                url.searchParams.set('sectionid', '0');
                // Marca a URL para evitar recursão
                url.searchParams.set('__init', '1');
                window.location.replace(url.toString());
                return;
            } else {
                // Falha segura: se ainda não tiver sectionid mesmo com __init, não continua
                console.warn('Parâmetro "sectionid" ausente mesmo após inicialização. Interrompendo script.');
                return;
            }
        }

        const container = document.querySelector('.course-section-tabs');
        if (!container) return;

        const allLi = [...container.querySelectorAll('ul.nav.nav-tabs.mb-3 > li')];
        if (!allLi.length) return;

        //remover a borda cinza que se mantém ao ocultar os itens do menu
        container.querySelectorAll('ul.nav.nav-tabs.mb-3').forEach(ul => ul.style.border = 'none');

        const sectionId = url.searchParams.get('sectionid');
        const isConteudo = window.location.hash === '#conteudo';

        const updateVisibility = () => {
            allLi.forEach((li, i) => {
                li.style.display = (sectionId !== '0' && isConteudo && i >= hiddenSection) ? '' : 'none';
            });
        };

        const setupLinkClicks = () => {
            const firstLinks = new Set(allLi.slice(0, hiddenSection).flatMap(li => [...li.querySelectorAll('a[href]')]));
            const afterLinks = new Set(allLi.slice(hiddenSection).flatMap(li => [...li.querySelectorAll('a[href]')]));

            container.querySelectorAll('a[href]').forEach(link => {
                link.removeEventListener('click', linkHandler);
                link.addEventListener('click', linkHandler);
            });

            function linkHandler(e) {
                const link = e.currentTarget;
                const href = new URL(link.href, window.location.origin);

                if (firstLinks.has(link) && window.location.hash === '#conteudo') {
                    e.preventDefault();
                    href.hash = '';
                    window.location.assign(href.toString());
                } else if (afterLinks.has(link)) {
                    e.preventDefault();
                    href.hash = 'conteudo';
                    window.location.assign(href.toString());
                }
            }
        };

        updateVisibility();
        setupLinkClicks();
        window.addEventListener('hashchange', () => {
            updateVisibility();
            setupLinkClicks();
        });
    });

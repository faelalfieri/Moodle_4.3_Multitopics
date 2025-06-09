    window.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location.href);

        // 1. Garante sectionid=0
        if (!url.searchParams.has('sectionid')) {
            url.searchParams.set('sectionid', '0');
            window.location.replace(url.toString());
            return;
        }

        const container = document.querySelector('.course-section-tabs');
        if (!container) return;

        // Seleciona todos os  filhos das ULs nav-tabs dentro do container, como lista única e linear
        const allLi = container.querySelectorAll('ul.nav.nav-tabs.mb-3 > li');
        if (allLi.length === 0) return;

        // Remove borda das ULs
        container.querySelectorAll('ul.nav.nav-tabs.mb-3').forEach(ul => {
            ul.style.border = 'none';
        });

        const sectionId = url.searchParams.get('sectionid');
        const hasConteudoHash = window.location.hash === '#conteudo';

        function updateVisibility() {
            if (sectionId === '0' || !hasConteudoHash) {
                // Oculta todas li
                allLi.forEach(li => li.style.display = 'none');
            } else {
                // Oculta só as primeiras 5 li, mostra as posteriores
                allLi.forEach((li, index) => {
                    li.style.display = index < 5 ? 'none' : '';
                });
            }
        }

        function setupLinkClicks() {
            const first5Li = Array.from(allLi).slice(0, 5);
            const after5Li = Array.from(allLi).slice(5);

            const first5Links = new Set();
            first5Li.forEach(li => {
                li.querySelectorAll('a[href]').forEach(link => first5Links.add(link));
            });

            const after5Links = new Set();
            after5Li.forEach(li => {
                li.querySelectorAll('a[href]').forEach(link => after5Links.add(link));
            });

            // Remove event listeners antes de adicionar (para evitar duplicação)
            container.querySelectorAll('a[href]').forEach(link => {
                link.removeEventListener('click', linkClickHandler);
                link.addEventListener('click', linkClickHandler);
            });

            function linkClickHandler(event) {
                const link = event.currentTarget;
                const href = link.getAttribute('href');
                const currentHash = window.location.hash;

                if (first5Links.has(link)) {
                    // Link clicado dentro das primeiras 5 li (ou descendentes)
                    if (currentHash === '#conteudo') {
                        event.preventDefault();
                        const targetUrl = new URL(link.href, window.location.origin);
                        targetUrl.hash = ''; // remove #conteudo
                        window.location.assign(targetUrl.toString());
                        return;
                    }
                    // Sem #conteudo, navega normalmente
                    return;
                }

                if (after5Links.has(link)) {
                    // Link clicado dentro das li após a 5ª (ou descendentes)
                    event.preventDefault();
                    const targetUrl = new URL(link.href, window.location.origin);
                    targetUrl.hash = 'conteudo'; // adiciona #conteudo
                    window.location.assign(targetUrl.toString());
                    return;
                }

                // Links fora da hierarquia navegam normalmente
            }
        }

        updateVisibility();
        setupLinkClicks();

        window.addEventListener('hashchange', () => {
            updateVisibility();
            setupLinkClicks();
        });
    });

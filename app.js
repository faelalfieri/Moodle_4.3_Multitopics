 window.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location.href);

        // 1. Garante sectionid=0
        if (!url.searchParams.has('sectionid')) {
            url.searchParams.set('sectionid', '0');
            window.location.replace(url.toString());
            return;
        }

        const ul = document.querySelector('.course-section-tabs ul');
        if (!ul) return;

        ul.style.border = 'none'; // remove borda da ul

        const items = ul.querySelectorAll('li');
        const sectionId = url.searchParams.get('sectionid');
        const hasConteudoHash = window.location.hash === '#conteudo';

        // 2 e 3 - controla visibilidade das li
        function updateVisibility() {
            if (sectionId === '0' || !hasConteudoHash) {
                // oculta todas
                items.forEach(li => {
                    li.style.display = 'none';
                });
            } else {
                // oculta só as primeiras 5
                items.forEach((li, index) => {
                    li.style.display = index < 5 ? 'none' : '';
                });
            }
        }

        // 4 e 5 - adiciona eventos nos links dentro das li, respeitando regras
        function setupLinkClicks() {
            const first5Li = Array.from(items).slice(0, 5);
            const first5Links = new Set();
            first5Li.forEach(li => {
                li.querySelectorAll('a[href]').forEach(link => first5Links.add(link));
            });

            const after5Li = Array.from(items).slice(5);
            const after5Links = new Set();
            after5Li.forEach(li => {
                li.querySelectorAll('a[href]').forEach(link => after5Links.add(link));
            });

            // Remove event listeners antigos antes de adicionar para evitar duplicados
            document.querySelectorAll('.course-section-tabs ul li a[href]').forEach(link => {
                link.removeEventListener('click', linkClickHandler);
                link.addEventListener('click', linkClickHandler);
            });

            function linkClickHandler(event) {
                const link = event.currentTarget;
                const href = link.getAttribute('href');
                const currentHash = window.location.hash;

                if (first5Links.has(link)) {
                    // 4 - clicou link das primeiras 5 li
                    if (currentHash === '#conteudo') {
                        event.preventDefault();
                        const targetUrl = new URL(link.href, window.location.origin);
                        targetUrl.hash = ''; // remove #conteudo
                        window.location.assign(targetUrl.toString());
                        return;
                    }
                    // Sem #conteudo, deixa navegar normalmente
                    return;
                }

                if (after5Links.has(link)) {
                    // 5 - clicou link após a 5 li
                    if (!href.includes('#conteudo')) {
                        event.preventDefault();
                        const targetUrl = new URL(link.href, window.location.origin);
                        targetUrl.hash = 'conteudo';
                        window.location.assign(targetUrl.toString());
                        return;
                    }
                    // Se já tem #conteudo no href, deixa navegar normalmente
                    return;
                }

                // Se o link não está nas li da .course-section-tabs ul, deixa navegar normalmente
            }
        }

        updateVisibility();
        setupLinkClicks();

        window.addEventListener('hashchange', () => {
            updateVisibility();
            setupLinkClicks();
        });
    });

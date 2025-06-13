//MutationObserver = executa apenas uma vez
(() => {
        const hiddenSection = 5;
        const observerConfig = {
            childList: true,
            subtree: true
        };

        const applyLogic = () => {
            const container = document.querySelector('.course-section-tabs');
            if (!container) return false;

            const navTabs = container.querySelector('ul.nav.nav-tabs.mb-3');
            const allLi = [...navTabs?.querySelectorAll('li') || []];
            if (!allLi.length) return false;

            // Evita reprocessar se já foi aplicado
            if (container.dataset.processed === '1') return true;
            container.dataset.processed = '1';

            navTabs.style.border = 'none';

            const url = new URL(window.location.href);
            const sectionId = url.searchParams.get('sectionid');
            const isConteudo = window.location.hash === '#conteudo';

            const updateVisibility = () => {
                allLi.forEach((li, i) => {
                    li.style.display = (sectionId !== '0' && isConteudo && i >= hiddenSection) ? '' : 'none';
                });
            };

            const linkHandler = (e) => {
                const link = e.currentTarget;
                const href = new URL(link.href, window.location.origin);

                const firstLinks = new Set(allLi.slice(0, hiddenSection).flatMap(li => [...li.querySelectorAll('a[href]')]));
                const afterLinks = new Set(allLi.slice(hiddenSection).flatMap(li => [...li.querySelectorAll('a[href]')]));

                if (firstLinks.has(link) && window.location.hash === '#conteudo') {
                    e.preventDefault();
                    href.hash = '';
                    window.location.assign(href.toString());
                } else if (afterLinks.has(link)) {
                    e.preventDefault();
                    href.hash = 'conteudo';
                    window.location.assign(href.toString());
                }
            };

            container.querySelectorAll('a[href]').forEach(link => {
                link.removeEventListener('click', linkHandler);
                link.addEventListener('click', linkHandler);
            });

            updateVisibility();

            window.addEventListener('hashchange', updateVisibility);
            return true;
        };

        // Redirecionamento inicial seguro
        document.addEventListener('DOMContentLoaded', () => {
            const url = new URL(window.location.href);
            if (!url.searchParams.has('sectionid') && !url.searchParams.has('__init')) {
                url.searchParams.set('sectionid', '0');
                url.searchParams.set('__init', '1');
                window.location.replace(url.toString());
                return;
            }

            // Se já estiver tudo carregado, executa direto
            if (applyLogic()) return;

            // Caso contrário, observa mudanças no DOM
            const observer = new MutationObserver(() => {
                if (applyLogic()) observer.disconnect();
            });

            observer.observe(document.body, observerConfig);
        });
    })();

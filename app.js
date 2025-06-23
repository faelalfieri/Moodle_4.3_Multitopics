<script>
    window.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location.href);
        const hiddenSection = 5;

        if (!url.searchParams.has('sectionid') && !url.searchParams.has('__init')) {
            url.searchParams.set('sectionid', '0');
            url.searchParams.set('__init', '1');
            window.location.replace(url.toString());
            return;
        }

        const container = document.querySelector('.course-section-tabs');
        if (!container) return;

        const allLi = [...container.querySelectorAll('ul.nav.nav-tabs.mb-3 > li')];
        if (!allLi.length) return;

        container.querySelectorAll('ul.nav.nav-tabs.mb-3').forEach(ul => ul.style.border = 'none');

        const sectionId = url.searchParams.get('sectionid');
        const isConteudo = window.location.hash === '#conteudo';

        const updateVisibility = () => {
            allLi.forEach((li, i) => {
                li.style.display = (sectionId !== '0' && isConteudo && i >= hiddenSection) ? '' : 'none';
            });
        };

        // Mover para fora para preservar referência
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

        const setupLinkClicks = () => {
            container.querySelectorAll('a[href]').forEach(link => {
                link.removeEventListener('click', linkHandler);
                link.addEventListener('click', linkHandler);
            });
        };

        updateVisibility();
        setupLinkClicks();

        window.addEventListener('hashchange', updateVisibility);
    });
</script>

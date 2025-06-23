<script>
    document.addEventListener('DOMContentLoaded', () => {
        const url = new URL(window.location.href);

        // Se não houver sectionid, redireciona para a mesma URL com sectionid=0
        if (!url.searchParams.has('sectionid')) {
            url.searchParams.set('sectionid', '0');
            window.location.replace(url.toString());
            return; // Impede execução do restante após redirecionamento
        }

        const sectionId = url.searchParams.get('sectionid');
        const isConteudo = window.location.hash === '#conteudo';
        const hiddenSectionStart = 5;

        const container = document.querySelector('.course-section-tabs');
        if (!container) return;

        const allLis = container.querySelectorAll('ul.nav.nav-tabs.mb-3 > li');
        if (!allLis.length) return;

        container.querySelectorAll('ul.nav.nav-tabs.mb-3').forEach(ul => ul.style.border = 'none');

        const toggleVisibility = () => {
            allLis.forEach((li, i) => {
                li.style.display = (sectionId !== '0' && isConteudo && i >= hiddenSectionStart) ? '' : 'none';
            });
        };

        const handleClick = (e) => {
            const href = new URL(e.currentTarget.href, location.origin);
            const liIndex = [...allLis].findIndex(li => li.contains(e.currentTarget));
            const isAfter = liIndex >= hiddenSectionStart;

            e.preventDefault();
            href.hash = isAfter ? 'conteudo' : '';
            window.location.assign(href);
        };

        container.querySelectorAll('a[href]').forEach(link => {
            link.addEventListener('click', handleClick);
        });

        toggleVisibility();
        window.addEventListener('hashchange', toggleVisibility);
    });
</script>

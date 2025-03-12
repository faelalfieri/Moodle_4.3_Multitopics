 /***Apontando conteudo para seção*/
 document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    const hasConteudoHash = window.location.hash === "#conteudo";
    const hasSectionId = urlParams.has("sectionid");

    // Redireciona para a URL com section=0 se nenhum parâmetro for encontrado
    if (!urlParams.has("section") && !hasConteudoHash) {
        let newUrl = window.location.href;
        newUrl += newUrl.includes("?") ? "&section=0" : "?section=0";
        if (hasConteudoHash) newUrl += "#conteudo";
        window.location.replace(newUrl);
    }

    // Oculta a primeira UL dentro da div com a classe .course-section-tabs
    const courseSectionTabs = document.querySelector(".course-section-tabs ul");
    if (courseSectionTabs) {
        courseSectionTabs.classList.add("hidden");
    }

    // Se a URL contém #conteudo, oculta as 6 primeiras LIs dentro da UL com classe .course-section-tabs
    //Esse código é para o menu1, e ele não abre o conteudo da seção, pois não tem link na âncora "conteúdo programático"
    // if (hasConteudoHash) {
    //     toggleListVisibility(".course-section-tabs ul", 6); // Oculta as 6 primeiras LIs
    //     hideFirstLiInTopicList(); // Oculta o primeiro LI da lista de tópicos
    //}

    // Se a URL contém &sectionid, oculta as 6 primeiras LIs dentro da UL com classe .course-section-tabs
    if (hasSectionId) {
        toggleListVisibility(".course-section-tabs ul", 6); // Oculta as 6 primeiras LIs
    }
    //obs.: Se ocultar a partir da sétima é possivel criar uma abertura com uma seção oculta para qndo clicar no conteúdo programático
});

// Função para ocultar as primeiras N LIs de uma UL e exibir as demais
function toggleListVisibility(ulSelector, visibleItemsCount) {
    const ul = document.querySelector(ulSelector);
    if (ul) {
        const listItems = ul.querySelectorAll("li");
        listItems.forEach((li, index) => {
            if (index < visibleItemsCount) {
                li.classList.add("hidden");
            } else {
                li.classList.remove("hidden");
            }
        });
        ul.classList.remove("hidden");
    }
}

// Função para ocultar o primeiro LI dentro da UL com a classe .sections.topics
function hideFirstLiInTopicList() {
    const topicsList = document.querySelector(".sections.topics");
    if (topicsList) {
        const firstLi = topicsList.querySelector("li");
        if (firstLi) {
            firstLi.style.display = "none";
        }
    }
}
/**
 * Para os 6 primeiros itens do menu principal, não pode ter um second-section-page, no segundo nível, apenas no terceiro nível sendo tópico fexivel ou não.
 * Caso seja da forma acima, o menu sequencial após o 6 primeiros itens principais também ficam visíveis.
 */
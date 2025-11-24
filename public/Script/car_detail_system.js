(function () {
    function start() {
        console.log("Car Detail System Loaded");

        // smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(link => {
            link.addEventListener("click", function (e) {
                e.preventDefault();
                const section = document.querySelector(this.getAttribute("href"));
                section.scrollIntoView({ behavior: "smooth" });
            });
        });
    }

    window.addEventListener("load", start);
})();

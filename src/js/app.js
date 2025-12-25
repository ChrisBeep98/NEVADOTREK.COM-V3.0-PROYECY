// NEVADO TREK - CINEMATIC MOTION SCRIPT
gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. HERO REVEAL ANIMATION
    const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

    tl.to(".reveal-text", {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.2,
        delay: 0.5
    });

    // Sub-animation for the hero image scale
    gsap.to("#hero-image", {
        scale: 1,
        duration: 3,
        ease: "power2.out"
    });

    // 2. NAVBAR SCROLL EFFECT
    ScrollTrigger.create({
        start: "top -50",
        onUpdate: (self) => {
            const nav = document.getElementById('navbar');
            if (self.direction === 1) { // Scrolling down
                nav.classList.add('-translate-y-32');
            } else { // Scrolling up
                nav.classList.remove('-translate-y-32');
                nav.classList.add('glass-panel');
            }
        }
    });

    // 3. PARALLAX HERO EFFECT
    gsap.to("#hero-image", {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
            trigger: "header",
            start: "top top",
            end: "bottom top",
            scrub: true
        }
    });

    // 4. BENTO GRID ENTRANCE
    gsap.from("article", {
        y: 100,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
        scrollTrigger: {
            trigger: "#expediciones",
            start: "top 80%",
            toggleActions: "play none none reverse"
        }
    });

    // 5. TEXT SHIMMER EFFECT (On Scroll)
    gsap.utils.toArray(".text-transparent").forEach(text => {
        gsap.to(text, {
            backgroundPositionX: "0%",
            stagger: 1,
            scrollTrigger: {
                trigger: text,
                scrub: 1,
                start: "top 90%",
                end: "bottom 10%"
            }
        });
    });
});

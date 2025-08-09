// Common JavaScript functionality for all pages

$(document).ready(function() {
    // Smooth scrolling for anchor links
    $('a[href^="#"]').on('click', function(e) {
        e.preventDefault();
        const target = $(this.getAttribute('href'));
        if (target.length) {
            const offsetTop = target.offset().top - 80;
            $('html, body').animate({
                scrollTop: offsetTop
            }, 500);
        }
    });

    // Active navigation highlighting for single page
    if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
        $(window).on('scroll', function() {
            const sections = $('h2[id]');
            const navLinks = $('.nav-link');
            
            let current = '';
            sections.each(function() {
                const sectionTop = $(this).offset().top - 100;
                if ($(window).scrollTop() >= sectionTop) {
                    current = $(this).attr('id');
                }
            });

            navLinks.each(function() {
                $(this).removeClass('active');
                if ($(this).attr('href') === `#${current}`) {
                    $(this).addClass('active');
                }
            });
        });
    }

    // Add fade-in animation to elements when they come into view
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    $('h2, .bibliography li, .news table tr, .card').each(function() {
        observer.observe(this);
    });

    // Back to top functionality
    $(window).on('scroll', function() {
        if ($(window).scrollTop() > 300) {
            if (!$('#backToTop').length) {
                $('body').append(`
                    <button id="backToTop" class="btn btn-primary" style="
                        position: fixed;
                        bottom: 20px;
                        right: 20px;
                        z-index: 1000;
                        border-radius: 50%;
                        width: 50px;
                        height: 50px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                    ">
                        <i class="fas fa-arrow-up"></i>
                    </button>
                `);
                
                $('#backToTop').on('click', function() {
                    $('html, body').animate({scrollTop: 0}, 500);
                });
            }
        } else {
            $('#backToTop').remove();
        }
    });

    // Navbar collapse on mobile when clicking links
    $('.navbar-nav .nav-link').on('click', function() {
        if ($('.navbar-toggler').is(':visible')) {
            $('.navbar-collapse').collapse('hide');
        }
    });

    // Add hover effects to cards
    $('.card, .bibliography li').hover(
        function() {
            $(this).addClass('shadow-lg');
        },
        function() {
            $(this).removeClass('shadow-lg');
        }
    );

    // Publications page specific functionality
    if (window.location.pathname.includes('publications.html')) {
        // Search functionality
        $('#searchInput').on('keyup', function() {
            filterPublications();
        });

        $('#yearFilter').on('change', function() {
            filterPublications();
        });

        function filterPublications() {
            const searchTerm = $('#searchInput').val().toLowerCase();
            const selectedYear = $('#yearFilter').val();
            
            $('.publication-item').each(function() {
                const title = $(this).find('.title').text().toLowerCase();
                const author = $(this).find('.author').text().toLowerCase();
                const year = $(this).data('year') ? $(this).data('year').toString() : '';
                
                const matchesSearch = title.includes(searchTerm) || author.includes(searchTerm);
                const matchesYear = selectedYear === '' || year === selectedYear;
                
                if (matchesSearch && matchesYear) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
            
            // Hide/show year headers based on visible publications
            $('.year-header').each(function() {
                const yearHeader = $(this);
                const nextBibliography = yearHeader.next('.bibliography');
                const visibleItems = nextBibliography.find('.publication-item:visible');
                
                if (visibleItems.length > 0) {
                    yearHeader.show();
                    nextBibliography.show();
                } else {
                    yearHeader.hide();
                    nextBibliography.hide();
                }
            });
        }

        // Abstract toggle functionality
        window.toggleAbstract = function(id) {
            $('#' + id).collapse('toggle');
            const button = $('button[onclick="toggleAbstract(\'' + id + '\')"]');
            const icon = button.find('i');
            
            $('#' + id).on('shown.bs.collapse', function() {
                icon.removeClass('fa-chevron-down').addClass('fa-chevron-up');
                button.html('<i class="fas fa-chevron-up"></i> Hide Abstract');
            });
            
            $('#' + id).on('hidden.bs.collapse', function() {
                icon.removeClass('fa-chevron-up').addClass('fa-chevron-down');
                button.html('<i class="fas fa-chevron-down"></i> Abstract');
            });
        };
    }

    // Blog page specific functionality
    if (window.location.pathname.includes('blog.html')) {
        // Add reading time calculation
        $('.post-list li').each(function() {
            const text = $(this).find('p').first().text();
            const wordCount = text.split(' ').length;
            const readTime = Math.ceil(wordCount / 200);
            
            const metaElement = $(this).find('.post-meta');
            if (metaElement.length && !metaElement.text().includes('min read')) {
                const currentMeta = metaElement.text();
                metaElement.text(`${readTime} min read • ${currentMeta}`);
            }
        });

        // Add tag filtering functionality
        $('.post-tags a').on('click', function(e) {
            e.preventDefault();
            const tag = $(this).text().replace('#', '').trim();
            
            $('.post-list li').each(function() {
                const postTags = $(this).find('.post-tags').text().toLowerCase();
                if (postTags.includes(tag.toLowerCase())) {
                    $(this).show();
                } else {
                    $(this).hide();
                }
            });
            
            // Add active state to clicked tag
            $('.post-tags a').removeClass('active');
            $(this).addClass('active');
            
            // Add clear filter button
            if (!$('#clearFilter').length) {
                $('.post-list').before(`
                    <div class="alert alert-info" id="clearFilter">
                        Filtering by tag: <strong>${tag}</strong>
                        <button type="button" class="close" onclick="clearTagFilter()">
                            <span>&times;</span>
                        </button>
                    </div>
                `);
            }
        });

        // Clear tag filter
        window.clearTagFilter = function() {
            $('.post-list li').show();
            $('.post-tags a').removeClass('active');
            $('#clearFilter').remove();
        };
    }

    // Add loading animation
    $('body').addClass('fade-in');

    // Preload images
    $('img').each(function() {
        const img = new Image();
        img.src = this.src;
    });

    // Add copy to clipboard functionality for DOI links
    $('.bibliography .links a[href*="doi.org"]').each(function() {
        const doiUrl = $(this).attr('href');
        $(this).attr('title', 'Click to copy DOI');
        
        $(this).on('click', function(e) {
            e.preventDefault();
            navigator.clipboard.writeText(doiUrl).then(function() {
                // Show tooltip
                const originalText = $(e.target).text();
                $(e.target).text('Copied!');
                setTimeout(() => {
                    $(e.target).text(originalText);
                }, 1000);
            });
        });
    });

    // Add print styles
    if (window.matchMedia) {
        const mediaQueryList = window.matchMedia('print');
        mediaQueryList.addListener(function(mql) {
            if (mql.matches) {
                $('.navbar, #backToTop').hide();
            } else {
                $('.navbar').show();
            }
        });
    }
});

// Utility functions
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Analytics tracking (placeholder)
function trackEvent(category, action, label) {
    // Add your analytics tracking code here
    console.log(`Event tracked: ${category} - ${action} - ${label}`);
}

// Track navigation clicks
$('.nav-link').on('click', function() {
    const page = $(this).text();
    trackEvent('Navigation', 'Click', page);
});

// Track publication link clicks
$('.bibliography .links a').on('click', function() {
    const linkType = $(this).text();
    trackEvent('Publications', 'Link Click', linkType);
});

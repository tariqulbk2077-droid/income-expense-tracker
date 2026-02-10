'use strict';

self.addEventListener('install', function(event) {
    console.log('Service Worker installing...');
    // Perform install steps
});

self.addEventListener('activate', function(event) {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', function(event) {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        fetch(event.request).catch(function() {
            return new Response('Network error occurred');
        })
    );
});
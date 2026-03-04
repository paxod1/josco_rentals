import React from 'react';

class GlobalErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        console.error('CRITICAL: React Error Caught:', error, errorInfo);

        // Clear all browser data for recovery
        this.clearAndRedirect();
    }

    clearAndRedirect() {
        // 1. Clear all cookies
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i];
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            document.cookie = name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
            document.cookie = name + '=; Path=/; Domain=' + window.location.hostname + '; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        }

        // 2. Clear LocalStorage & SessionStorage
        try {
            localStorage.clear();
            sessionStorage.clear();
        } catch (e) {
            console.error('Failed to clear storage:', e);
        }

        // 3. Unregister Service Workers
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.getRegistrations().then(registrations => {
                for (let registration of registrations) {
                    registration.unregister();
                }
            }).catch(err => console.error('SW unregister failed:', err));
        }

        // 4. Redirect to login
        // Add a flag to prevent loops
        if (!window.location.search.includes('recovered=true')) {
            window.location.replace('/login?recovered=true');
        }
    }

    render() {
        if (this.state.hasError) {
            // Return a blank screen or a loading spinner while redirecting
            return null;
        }

        return this.props.children;
    }
}

export default GlobalErrorBoundary;

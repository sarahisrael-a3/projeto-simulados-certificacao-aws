// js/validation/validationStorage.js
window.ValidationStorage = {
    KEYS: {
        VALIDATOR_NAME: 'validator_name',
        STATS: 'validation_stats'
    },

    getValidatorName() {
        return localStorage.getItem(this.KEYS.VALIDATOR_NAME);
    },

    setValidatorName(name) {
        localStorage.setItem(this.KEYS.VALIDATOR_NAME, name);
    },

    getTodayStats() {
        const today = new Date().toISOString().split('T')[0];
        let stats = JSON.parse(localStorage.getItem(this.KEYS.STATS) || '{}');
        
        // Reseta as estatísticas se o dia mudou
        if (stats.date !== today) {
            stats = { date: today, approved: 0, rejected: 0 };
            this.saveStats(stats);
        }
        return stats;
    },

    saveStats(stats) {
        localStorage.setItem(this.KEYS.STATS, JSON.stringify(stats));
    },

    incrementApproved() {
        const stats = this.getTodayStats();
        stats.approved++;
        this.saveStats(stats);
    },

    incrementRejected() {
        const stats = this.getTodayStats();
        stats.rejected++;
        this.saveStats(stats);
    }
};

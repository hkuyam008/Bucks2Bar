const { myFunction } = require('./scripts');


describe('usernamePattern validation', () => {
    const usernamePattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    test('should validate a username with at least one uppercase letter, one number, one special character, and at least 8 characters', () => {
        const validUsername = 'Password1!';
        expect(usernamePattern.test(validUsername)).toBe(true);
    });

    test('should invalidate a username without an uppercase letter', () => {
        const invalidUsername = 'password1!';
        expect(usernamePattern.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username without a number', () => {
        const invalidUsername = 'Password!';
        expect(usernamePattern.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username without a special character', () => {
        const invalidUsername = 'Password1';
        expect(usernamePattern.test(invalidUsername)).toBe(false);
    });

    test('should invalidate a username with less than 8 characters', () => {
        const invalidUsername = 'Pass1!';
        expect(usernamePattern.test(invalidUsername)).toBe(false);
    });

    test('should validate a username with exactly 8 characters meeting all criteria', () => {
        const validUsername = 'Pass1@AB';
        expect(usernamePattern.test(validUsername)).toBe(true);
    });
});
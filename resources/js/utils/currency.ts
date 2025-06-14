export const formatCurrency = (amount: number | null): string => {
    if (amount === null) return '0 XOF';
    return amount.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}; 
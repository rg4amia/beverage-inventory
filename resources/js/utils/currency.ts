export const formatCurrency = (amount: number | null | undefined): string => {
    if (amount === null || amount === undefined) return '0 XOF';
    return amount.toLocaleString('fr-FR', {
        style: 'currency',
        currency: 'XOF',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    });
}; 
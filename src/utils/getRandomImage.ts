export function getRandomImage(max_number: number): string {
    const randomNumber = Math.floor(Math.random() * (max_number-1)) + 1;
    return `/main/${randomNumber}.jpg`;
}
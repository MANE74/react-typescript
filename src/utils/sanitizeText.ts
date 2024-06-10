// Cleanup your text :)
export function sanitizeText(text: string, remove: string): string {
    let cleanedText = text;
    if (remove === 'html') {
        const temp = document.createElement("p");
        temp.innerHTML = cleanedText;
        cleanedText = temp.textContent || temp.innerText;
        // cleanedText.replace(/(<([^>]+)>)/gi, '');
    }
    return cleanedText;
}

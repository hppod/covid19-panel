export function endpoint(entity: string) {
    return `https://brasil.io/api/dataset/covid19/${{ entity }}/data`
}
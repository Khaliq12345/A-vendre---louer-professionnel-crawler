

export type parseResponseType = object[] | undefined | null

/**
 * 
 * @param responseBody - The html from the requests
 * @returns - the items extracted from the response or none
 */
export function parseResponse(responseBody: string): parseResponseType {
    
    const jsonData = JSON.parse(responseBody);
    if (jsonData.items !== undefined) {
        const items: object[] = jsonData.items
        console.log(`Total: ${items.length}`)
        return items
    }
    return null

}


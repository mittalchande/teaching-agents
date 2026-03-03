from ddgs import DDGS

def search_web(query: str, max_results: int = 3) -> str:
    with DDGS() as ddgs:
        results = list(ddgs.text(query, max_results=max_results,region="us-en"))
    
    if not results:
        return "No results found."
    
    # Format results into a readable string for the LLM
    formatted = []
    for r in results:
        formatted.append(f"Title: {r['title']}\nSummary: {r['body']}")
    
    return "\n\n".join(formatted)
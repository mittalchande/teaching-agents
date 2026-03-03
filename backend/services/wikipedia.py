import wikipediaapi 

def search_wikipedia(topic: str) -> str:
    wiki = wikipediaapi.Wikipedia(
        language = "en",
        user_agent="TeacherAgent/1.0"
    )

    page = wiki.page(topic)

    if not page.exists():
        return "No wikipedia article found for this topic."
    
    return f"Title: {page.title}\nSummary: {page.summary[:1000]}"
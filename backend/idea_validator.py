"""
AI Business Idea Validator Service Module
Provides LLM-powered analysis for startup/business ideas.
"""

import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv

load_dotenv()

# Initialize LLM
llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)


VALIDATION_PROMPT = """You are an expert startup advisor and business analyst. 
Analyze the following business idea comprehensively and provide actionable insights.

Business Idea Details:
- Title: {title}
- Problem Being Solved: {problem}
- Target Users/Customers: {target_users}
- Industry: {industry}
- Business Model: {business_model}
- Target Market/Country: {target_market}
- Additional Notes: {additional_notes}

Provide a detailed analysis in the following JSON structure. Be specific, actionable, and realistic.

{{
    "idea_summary": "A concise 2-3 sentence summary of the business idea",
    "market_demand": {{
        "score": 1-10,
        "analysis": "Detailed market demand analysis",
        "trends": ["Relevant market trend 1", "Trend 2"],
        "market_size": "Estimated market size if applicable"
    }},
    "target_customers": {{
        "primary": "Primary target customer description",
        "secondary": "Secondary target customer description", 
        "pain_points": ["Pain point 1", "Pain point 2"],
        "buying_behavior": "How they typically make purchasing decisions"
    }},
    "competition": {{
        "level": "low/medium/high",
        "direct_competitors": ["Competitor 1", "Competitor 2"],
        "indirect_competitors": ["Alternative solution 1"],
        "differentiation": "How this idea can stand out",
        "competitive_advantage": "Key competitive advantages"
    }},
    "risks": [
        {{
            "type": "Risk category (market/technical/financial/regulatory)",
            "description": "Risk description",
            "severity": "low/medium/high",
            "mitigation": "How to mitigate this risk"
        }}
    ],
    "improvements": [
        "Specific improvement suggestion 1",
        "Specific improvement suggestion 2",
        "Specific improvement suggestion 3"
    ],
    "monetization": [
        {{
            "model": "Revenue model name",
            "description": "How it works",
            "potential": "low/medium/high",
            "considerations": "Things to consider"
        }}
    ],
    "mvp_recommendation": {{
        "core_features": ["Feature 1", "Feature 2", "Feature 3"],
        "nice_to_have": ["Feature 4", "Feature 5"],
        "timeline": "Estimated development timeline",
        "budget_range": "Rough budget estimate",
        "tech_stack": "Recommended technologies"
    }},
    "growth_strategy": {{
        "short_term": "0-6 months strategy",
        "medium_term": "6-18 months strategy", 
        "long_term": "18+ months vision",
        "key_metrics": ["Metric 1", "Metric 2"]
    }},
    "viability_score": 1-10,
    "score_breakdown": {{
        "market_opportunity": 1-10,
        "execution_feasibility": 1-10,
        "uniqueness": 1-10,
        "revenue_potential": 1-10,
        "scalability": 1-10
    }},
    "verdict": "A final 2-3 sentence verdict on the idea's viability"
}}

Return ONLY valid JSON. No explanations or markdown formatting."""


REFINEMENT_PROMPT = """You are an expert startup advisor. 
The user has a business idea that was previously analyzed.

Original Idea:
{original_idea}

Previous Analysis:
{previous_analysis}

User's Refinement Request: {instruction}

Based on the user's request, provide an UPDATED analysis with the same JSON structure.
Adjust scores, recommendations, and insights based on the refinement.
Return ONLY valid JSON."""


NAME_GENERATION_PROMPT = """You are a creative branding expert.
Generate 10 unique, memorable startup names for the following business idea:

Title: {title}
Description: {description}
Industry: {industry}

Requirements:
- Names should be catchy and memorable
- Easy to pronounce and spell  
- Available as .com domain (use creative spellings if needed)
- Mix of different styles (professional, playful, technical, abstract)

Return a JSON array of objects:
[
    {{"name": "StartupName", "style": "professional/playful/technical/abstract", "reasoning": "Why this name works"}}
]

Return ONLY valid JSON array."""


TAGLINE_PROMPT = """You are a marketing copywriter expert.
Generate 5 compelling taglines for this startup:

Name: {name}
Description: {description}
Target Audience: {target_audience}

Requirements:
- Under 10 words each
- Memorable and impactful
- Communicate core value proposition
- Mix of different tones

Return a JSON array:
[
    {{"tagline": "Your tagline here", "tone": "professional/inspiring/playful/bold"}}
]

Return ONLY valid JSON array."""


def _parse_llm_response(content: str) -> dict:
    """Parse LLM response, handling markdown code blocks."""
    cleaned = content.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return json.loads(cleaned.strip())


async def validate_idea(idea_data: dict) -> dict:
    """
    Main function to validate a business idea using LLM.
    
    Args:
        idea_data: Dictionary with keys: title, problem, target_users, 
                   industry, business_model, target_market, additional_notes
    
    Returns:
        Structured analysis dictionary
    """
    chain = ChatPromptTemplate.from_messages([
        ("system", "You are an expert business analyst. Always respond with valid JSON only."),
        ("human", VALIDATION_PROMPT)
    ]) | llm
    
    result = await chain.ainvoke({
        "title": idea_data.get("title", ""),
        "problem": idea_data.get("problem", ""),
        "target_users": idea_data.get("target_users", ""),
        "industry": idea_data.get("industry", "General"),
        "business_model": idea_data.get("business_model", "Not specified"),
        "target_market": idea_data.get("target_market", "Global"),
        "additional_notes": idea_data.get("additional_notes", "None")
    })
    
    return _parse_llm_response(result.content)


async def refine_idea(original_idea: dict, previous_analysis: dict, instruction: str) -> dict:
    """
    Refine an existing idea analysis based on user instructions.
    
    Args:
        original_idea: The original idea data
        previous_analysis: The previous LLM analysis
        instruction: User's refinement instruction (e.g., "Make it cheaper", "Target B2B")
    
    Returns:
        Updated analysis dictionary
    """
    chain = ChatPromptTemplate.from_messages([
        ("system", "You are an expert business analyst. Always respond with valid JSON only."),
        ("human", REFINEMENT_PROMPT)
    ]) | llm
    
    result = await chain.ainvoke({
        "original_idea": json.dumps(original_idea),
        "previous_analysis": json.dumps(previous_analysis),
        "instruction": instruction
    })
    
    return _parse_llm_response(result.content)


async def generate_startup_names(title: str, description: str, industry: str) -> list:
    """
    Generate creative startup name suggestions.
    
    Returns:
        List of name suggestions with reasoning
    """
    chain = ChatPromptTemplate.from_messages([
        ("system", "You are a creative branding expert. Always respond with valid JSON only."),
        ("human", NAME_GENERATION_PROMPT)
    ]) | llm
    
    result = await chain.ainvoke({
        "title": title,
        "description": description,
        "industry": industry
    })
    
    return _parse_llm_response(result.content)


async def generate_tagline(name: str, description: str, target_audience: str) -> list:
    """
    Generate tagline suggestions for a startup.
    
    Returns:
        List of tagline suggestions with tone
    """
    chain = ChatPromptTemplate.from_messages([
        ("system", "You are a marketing copywriter. Always respond with valid JSON only."),
        ("human", TAGLINE_PROMPT)
    ]) | llm
    
    result = await chain.ainvoke({
        "name": name,
        "description": description,
        "target_audience": target_audience
    })
    
    return _parse_llm_response(result.content)


# Industry categories for dropdown
INDUSTRY_CATEGORIES = [
    "Technology / SaaS",
    "E-commerce / Retail",
    "Healthcare / MedTech",
    "FinTech / Finance",
    "EdTech / Education",
    "Food & Beverage",
    "Real Estate / PropTech",
    "Transportation / Logistics",
    "Entertainment / Media",
    "Agriculture / AgTech",
    "Travel / Hospitality",
    "Manufacturing",
    "Energy / CleanTech",
    "Social Impact / Non-profit",
    "Other"
]

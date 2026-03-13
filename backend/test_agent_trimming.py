import sys
import os

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from backend.agent import _trim
from langchain_core.messages import HumanMessage, AIMessage

def test_trimming():
    print("Testing context trimming...")
    
    # Create a history of 100 messages
    messages = []
    for i in range(100):
        if i % 2 == 0:
            messages.append(HumanMessage(content=f"Human message {i} " * 50))
        else:
            messages.append(AIMessage(content=f"AI response {i} " * 50))
            
    print(f"Original message count: {len(messages)}")
    
    # Trim to a small token limit for testing
    trimmed = _trim(messages, max_tokens=1000)
    
    print(f"Trimmed message count: {len(trimmed)}")
    assert len(trimmed) < len(messages), "Trimming should reduce message count"
    assert isinstance(trimmed[0], HumanMessage), "Trimming should start on human message"
    
    print("Trimming test passed!")

if __name__ == "__main__":
    try:
        test_trimming()
    except Exception as e:
        print(f"Test failed: {e}")
        sys.exit(1)

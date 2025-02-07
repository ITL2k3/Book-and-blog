from fastapi import FastAPI
from pydantic import BaseModel
from transformers import BertTokenizer, BertModel
import torch

# Tạo FastAPI app
app = FastAPI()

# Tải mBERT tokenizer và model
tokenizer = BertTokenizer.from_pretrained('bert-base-multilingual-uncased')
model = BertModel.from_pretrained('bert-base-multilingual-uncased')

class BookRequest(BaseModel):
    text: str  # Nội dung sách



# Hàm nhúng nội dung sách
def get_book_vector(book_text: str):
    # Tokenize nội dung sách
    inputs = tokenizer(book_text, return_tensors="pt", truncation=True, padding=True, max_length=512)
    
    # Lấy vector từ mBERT
    with torch.no_grad():
        outputs = model(**inputs)
    # Lấy embedding của từ cuối cùng trong chuỗi
    book_vector = outputs.last_hidden_state.mean(dim=1)  # Average pooling across token embeddings
    return book_vector.squeeze().tolist()  # Convert tensor to list

# Định nghĩa endpoint API
@app.post("/get_book_vector/")
async def get_book_vector_endpoint(book: BookRequest):
    book_vector = get_book_vector(book.text)
    return {"book_vector": book_vector}

# Câu lệnh để chạy server FastAPI
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="localhost", port=8000)

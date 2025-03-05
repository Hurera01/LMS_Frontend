import { Component, inject } from '@angular/core';
import { BookService } from '../../core/services/book.service';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgFor } from '@angular/common';
import { NzPaginationComponent } from 'ng-zorro-antd/pagination';
import { FormsModule } from '@angular/forms';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';


@Component({
  selector: 'app-books',
  imports: [NzTableModule, NgFor,NzButtonModule, NzPaginationComponent, FormsModule, NzModalModule,NzFormModule],
  templateUrl: './books.component.html',
  styleUrl: './books.component.scss'
})
export class BooksComponent {
  listOfData: ItemData[] = [];
  pageIndex: number = 1; 
  pageSize: number = 5;
  total: number = 0; 
  selectedBook: ItemData = { book_id: 0, title: '', genre: '', publish_year: '', author_name: '' };
  isEditModalVisible = false;
  isVisible = false;

  private bookService = inject(BookService);

  ngOnInit(): void {
    this.fetchBooks();
  }

  onPageChange(page: number): void {
    this.pageIndex = page;
    this.fetchBooks(); 
  }

  fetchBooks(){
    this.bookService.getBooks(this.pageIndex, this.pageSize).subscribe(
      (data) => {
        this.listOfData = data.books;
        this.total = data.totalCount;
        console.log(data);
      },
      (error) => {
        console.error('Error occurred:', error);
      }
    );
  }

  onDeleteBook(book: ItemData): void {
    if (confirm(`Are you sure you want to delete ${book.title}?`)) {
      this.bookService.deleteBook(book.book_id).subscribe(() => {
        this.listOfData = this.listOfData.filter(b => b.book_id !== book.book_id);
      });
    }
  }

  updateBook(): void {
    debugger;
    console.log('Updated user:', this.selectedBook);
    const bookObj = this.selectedBook;
    const book = {
      Title: bookObj.title,
      Genre: bookObj.genre,
      PublishYear: bookObj.publish_year,
      AuthorName: bookObj.author_name
    }
    this.bookService.editUser(bookObj.book_id, book).subscribe(() => {
      this.fetchBooks();
      this.isEditModalVisible = false;
    });
  }

  onEditBook(book: ItemData): void {
    this.selectedBook = { ...book }; 
    this.isEditModalVisible = true;
  }

  showModal(): void {
    this.isVisible = true;
  }
  handleOk(): void {
    console.log('Button ok clicked!');
    this.isVisible = false;
  }

  handleCancel(): void {
    console.log('Button cancel clicked!');
    this.isVisible = false;
  }
}



interface ItemData {
  book_id: number;
  title: string;
  genre: string;
  publish_year: string;
  author_name: string;
}
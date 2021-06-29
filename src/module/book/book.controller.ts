import { Body, Controller, Post } from '@nestjs/common';
import { BookRes } from 'src/response/book.res';
import { BookDTO } from 'src/validation/book.dto';
import { BookService } from './book.service';

@Controller('book')
export class BookController {
    constructor(
        private readonly bookService: BookService,
    ) { }


    @Post()
    async bookEvent(
        @Body() bookDTO: BookDTO
    ): Promise<BookRes> {
        let res = await this.bookService.bookEvent(bookDTO)

        return {
            success: res,
            data: 'Event booked'
        }
    }
}

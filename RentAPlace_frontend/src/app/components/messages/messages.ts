import { Component, OnInit } from '@angular/core';
import { MessageService } from '../../services/message';
import { AuthService } from '../../services/auth';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-messages',
  standalone: false,
  templateUrl: './messages.html',
  styleUrls: ['./messages.css']
})
export class Messages implements OnInit {
  conversation: any[] = [];
  newMessage = '';
  receiverId: number = 0;
  propertyId: number = 0;
  successMsg = '';
  errorMsg = '';

  constructor(
    private messageService: MessageService,
    public authService: AuthService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.receiverId = Number(params['receiverId']);
      this.propertyId = Number(params['propertyId']);
      if (this.receiverId && this.propertyId) {
        this.loadConversation();
      }
    });
  }

  loadConversation() {
    const senderId = Number(this.authService.getUserId());
    this.messageService.getConversation(senderId, this.receiverId, this.propertyId).subscribe({
      next: (res) => this.conversation = res,
      error: (err) => console.error(err)
    });
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;
    const data = {
      senderId: Number(this.authService.getUserId()),
      receiverId: this.receiverId,
      propertyId: this.propertyId,
      content: this.newMessage
    };
    this.messageService.sendMessage(data).subscribe({
      next: () => {
        this.newMessage = '';
        this.loadConversation();
      },
      error: () => this.errorMsg = 'Failed to send message'
    });
  }
}
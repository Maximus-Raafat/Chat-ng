import { Component, Inject, effect, inject, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChatService } from '../../supabase/chat.service';
import { Ichat } from '../../interface/chat-response';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [ReactiveFormsModule,DatePipe],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.css'
})
export class ChatComponent {
  private auth = inject(AuthService);
  private router = inject(Router);
  chatForm: FormGroup;
  private chat_service = inject(ChatService)
  chats = signal<Ichat[]>([])
  constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    this.chatForm = this.fb.group({
      chat_message: ['', Validators.required]
    });
    effect(()=>{
      this.onListChat();
    })
  }
  async logOut() {
    this.auth
    .signOut().then(()=>{
      this.router.navigate(['/login']);
    }).catch((error)=>{
      alert(error.message);
    })
  }

  onSubmit(){
    const formValue = this.chatForm.value.chat_message;
    console.log(formValue);
    this.chatForm.reset();
    this.chat_service.chatMessage(formValue).then((res)=>{
      console.log(res)
    }).catch((err)=>{
      alert(err.message);
    })
  }

  onListChat(){
    this.chat_service.listChat().then((res:Ichat[] | null)=> { 
      console.log(res)
      if (res !== null) {
        this.chats.set(res);
        this.onListChat();
      } else { 
        console.log("No Messages Found!")
      }
    }).catch((err) => {
      alert(err.message);
    })
  }

}

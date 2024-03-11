<template>
    <div>
        <div class="container">
            <!-- <button class="btn-login" v-if="!isLoggedIn" @click="login">Login Dulu Dong (Pake Google Biar Ga Ribet) 😇</button> -->
            <!-- <div class="wrapper" :class="{ blur: !isLoggedIn }"> -->
            <div class="wrapper">
                <div class="card">
                    <!-- <button class="btn-logout" v-if="isLoggedIn" @click="logout">Logout</button> -->
                    <button class="btn-logout" v-if="isLoggedIn" @click="yourName">Nama Anda</button>
                    <div class="chat-card" ref="chatCard">
                        <div class="chat" v-for="i in chatData" :key="i.id">

                            <div v-if="i.name != isLoggedInName || i.name == 'anonim'">
                                <div class="message">{{ i.chat }}</div>
                                <div class="name"><small>{{ i.name }} - {{ i.time }} <span
                                            style="color: red; cursor: pointer;" @click="deleteMessage(i)"
                                            v-if="isLoggedInName == '486399'"> - Hapus</span></small>
                                </div>
                            </div>

                            <div class="chat-you" v-if="i.name == isLoggedInName && i.name != 'anonim'">
                                <div class="message-you">{{ i.chat }}</div>
                                <div class="name-you"><small>{{ i.name }} - {{ i.time }} - <span
                                            style="color: red; cursor: pointer;"
                                            @click="deleteMessage(i)">Hapus</span></small></div>
                            </div>

                        </div>
                    </div>
                    <div class="input">
                        <input type="text" class="chat-form" v-model="chat" @keypress.enter="sendMessage"
                            :placeholder="`Ketik Pesan Sebagai ${isLoggedInName}`">
                        <button class="chat-send" @click="sendMessage"><i
                                class="fa-regular fa-paper-plane"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Timestamp, addDoc, collection, deleteDoc, doc, getFirestore, onSnapshot, orderBy, query } from 'firebase/firestore'
import { getAuth, signInWithPopup, GoogleAuthProvider } from 'firebase/auth'
import { db } from '../../firebase'
import swal from 'sweetalert'

export default {
    name: 'app',
    data() {
        return {
            isLoggedIn: true,
            chat: '',
            chatData: {},
            // isLoggedInName: ''
            isLoggedInName: localStorage.getItem('name')
        }
    },
    updated() {
        this.scrollToBottom();
    },
    mounted() {
        // this.isLoggedInName = localStorage.getItem('isLoggedIn') ? JSON.parse(localStorage.getItem('user')).name : "anonim"
        // this.isLoggedIn = localStorage.getItem('isLoggedIn') ? true : false
        this.scrollToBottom()
        this.changeName()
        // Get Chat
        const db = getFirestore()
        const chatCollection = collection(db, 'chatDB')
        onSnapshot(query(chatCollection, orderBy('waktu', 'asc')), (snapshot) => {
            this.chatData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
            console.log(this.chatData[0].chat)
        })
        // Get Chat
    },
    methods: {
        changeName() {
            this.isLoggedInName = localStorage.getItem('name') ? localStorage.getItem('name') : "anonim"
        },
        yourName() {
            let name = prompt("Masukkan nama anda")
            localStorage.setItem('name', name)
            location.reload()
        },
        async login() {
            try {
                const auth = getAuth()
                const provider = new GoogleAuthProvider()
                const result = await signInWithPopup(auth, provider)
                const user = result.user

                const loggedInUser = {
                    name: user.displayName,
                    email: user.email,
                    emailVerifed: user.emailVerified,
                    profil: user.photoURL,
                    number: user.phoneNumber
                }

                localStorage.setItem('user', JSON.stringify(loggedInUser))
                localStorage.setItem('isLoggedIn', true)
                location.reload()
            } catch (er) {
                console.log(er)
            }
        },
        async logout() {
            const confirm = await swal({
                icon: 'warning',
                title: 'Mau Logout?',
                buttons: ['Gaa', "Iyaa"],
                dangerMode: true
            })

            if (confirm) {
                await localStorage.clear()
                location.reload()
            }
        },
        async sendMessage() {
            if (this.chat == '') {
                alert('isi dulu')
            } else {
                console.log('chat terkirim')
                let chatToSend = {
                    time: new Date().toLocaleDateString(),
                    waktu: Timestamp.now().toMillis(),
                    // name: JSON.parse(localStorage.getItem('user')).name,
                    name: localStorage.getItem('name') ? localStorage.getItem('name') : "anonim",
                    chat: this.chat
                }
                await addDoc(collection(db, 'chatDB'), chatToSend)
                this.chat = ''
                // alert('chat berhasil terkirim')
            }
        },
        async deleteMessage(i) {
            console.log(`Hapus chat dengan id: ${i.id}`)
            const alert = await swal({
                icon: 'warning',
                title: 'Mau dihapus?',
                buttons: ['Ga', 'Ya'],
                dangerMode: true
            })
            try {
                if (alert) {
                    const db = getFirestore()
                    const chatDoc = doc(db, 'chatDB', i.id)
                    await deleteDoc(chatDoc)
                    console.log('Berhasil hapus')
                }
            } catch (er) {
                console.log(er)
            }
        },
        scrollToBottom() {
            this.$nextTick(() => {
                const chatCard = this.$refs.chatCard;

                chatCard.scrollTop = chatCard.scrollHeight;
            });
        },
    }
}
</script>

<style scoped>
.blur {
    filter: blur(30px);
}

.container {
    user-select: none;
    position: fixed;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    background-color: #201658;
}

.btn-logout {
    padding: 12px 20px;
    border: none;
    background-color: #F9E8C9;
    border-radius: 10px;
    font-size: 1.2rem;
    font-weight: bolder;
    cursor: pointer;
}

.wrapper {
    /* border: 1px solid yellow; */
    width: 100vw;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card {
    width: 90%;
    height: 80%;
    margin-bottom: 60px;
}

.chat-card {
    /* border: 1px solid yellow; */
    margin-top: 10px;
    height: 87.2%;
    margin-bottom: 10px;
    background-color: #F9E8C9;
    -webkit-backdrop-filter: blur(40px);
    backdrop-filter: blur(4px);
    border-radius: 15px;
    overflow-y: auto;
    scroll-behavior: smooth;
    scroll-snap-type: y mandatory;
}

.chat {
    margin-bottom: 10px
}

.chat .message {
    background-color: #201658;
    width: fit-content;
    padding: 10px;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-left: 10px;
    color: #F9E8C9;
    font-weight: bolder;
    border-radius: 0 10px 10px 10px;
    font-size: 1.2rem;
    max-width: 90%;
    word-break: break-word;
}

.chat .name {
    margin-left: 10px;
    color: #201658;
    font-weight: bolder;
    margin-top: 5px
}

.chat-you {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: end;
    margin-top: 10px;
    margin-bottom: 10px;
    margin-right: 10px;
}

.message-you {
    background-color: #201658;
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    margin-right: 10px;
    color: #F9E8C9;
    font-weight: bolder;
    border-radius: 10px 0 10px 10px;
    font-size: 1.2rem;
    max-width: 90%;
    word-break: break-word;
}

.name-you {
    text-align: right;
    margin-right: 10px;
    margin-top: 5px;
    font-weight: bolder;
    color: #201658;
}

.input {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.chat-form {
    font-size: 1.1rem;
    padding: 10px 10px;
    width: 80%;
    border: none;
    border-radius: 10px 0 0 10px;
    background-color: #F9E8C9;
    color: #201658;
    margin-bottom: 10px;
}

.chat-send {
    background-color: #201658;
    font-size: 1.1rem;
    padding: 10px 15px;
    margin-bottom: 10px;
    color: #F9E8C9;
    cursor: pointer;
    border: 1px solid #F9E8C9;
    border-radius: 0 10px 10px 0;
    transition: 0.3s;
}

.chat-send:hover {
    background-color: #F9E8C9;
    color: #201658;
    border: 1px solid #201658;
}

.btn-login {
    font-weight: bolder;
    font-size: 1.2rem;
    padding: 12px 20px;
    border-radius: 10px;
    background-color: #201658;
    color: #F9E8C9;
    cursor: crosshair;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 999;
}
</style>
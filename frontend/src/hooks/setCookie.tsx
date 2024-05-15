import Cookies from "js-cookie"

export default function setCookie(name:string, value:string, expires:number) {
    Cookies.set(name, value, { expires: expires, secure: true });

}

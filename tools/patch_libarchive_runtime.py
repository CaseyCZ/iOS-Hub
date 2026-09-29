#!/usr/bin/env python3
from pathlib import Path

LIB = Path("vendor/libarchive/libarchive.js")
WORKER = Path("vendor/libarchive/worker-bundle.js")


def replace_once(text: str, old: str, new: str, label: str) -> str:
    if new in text:
        return text
    if old not in text:
        raise RuntimeError(f"Unable to apply {label}: expected libarchive.js 2.0.2 layout was not found")
    return text.replace(old, new, 1)


lib = LIB.read_text(encoding="utf-8")
lib = replace_once(
    lib,
    'async extractSingleFile(e){if(null===this.worker)throw new Error("Archive already closed");const t=await this.client.extractSingleFile(e);return new File([t.fileData],t.fileName,{type:"application/octet-stream",lastModified:t.lastModified/1e6})}async extractFiles(e=void 0){',
    'async extractSingleFile(e){if(null===this.worker)throw new Error("Archive already closed");const t=await this.client.extractSingleFile(e);return new File([t.fileData],t.fileName,{type:"application/octet-stream",lastModified:t.lastModified/1e6})}async extractFilesByPrefix(e){if(null===this.worker)throw new Error("Archive already closed");const t={};return(await this.client.extractFilesByPrefix(e)).forEach((e=>{const[n,r]=S(t,e.path);"FILE"===e.type&&(n[r]=new File([e.fileData],e.fileName,{type:"application/octet-stream",lastModified:e.lastModified/1e6}))})),this.worker&&this.worker.terminate(),this.worker=null,this.client=null,b(t)}async extractFiles(e=void 0){',
    "libarchive prefix extraction API",
)
LIB.write_text(lib, encoding="utf-8")

worker = WORKER.read_text(encoding="utf-8")
worker = replace_once(
    worker,
    "*entries(e=!1,r=null){let t;",
    "*entries(e=!1,r=null,o=null){let t;",
    "worker prefix parameter",
)
worker = replace_once(
    worker,
    "if(e&&r!==n.path)this._runCode.skipEntry(this._archive);else{",
    'if(e&&(o?!(n.path.startsWith(o)||n.path.startsWith("./"+o)||n.path.startsWith("/"+o)):r!==n.path))this._runCode.skipEntry(this._archive);else{',
    "worker prefix filter",
)
worker = replace_once(
    worker,
    "extractFiles(){let e=[];for(const r of F.entries(!1))e.push(r);return e}extractSingleFile(e){",
    "extractFiles(){let e=[];for(const r of F.entries(!1))e.push(r);return e}extractFilesByPrefix(e){let r=[];for(const t of F.entries(!0,null,e))t.fileData&&r.push(t);return r}extractSingleFile(e){",
    "worker prefix extraction method",
)
WORKER.write_text(worker, encoding="utf-8")
print("Patched libarchive runtime for selective app extraction.")

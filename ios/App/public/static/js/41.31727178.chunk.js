(this.webpackJsonpdocuclip=this.webpackJsonpdocuclip||[]).push([[41],{397:function(n,t,e){"use strict";e.r(t),e.d(t,"startFocusVisible",(function(){return s}));var o="ion-focused",c=["Tab","ArrowDown","Space","Escape"," ","Shift","Enter","ArrowLeft","ArrowRight","ArrowUp"],s=function(){var n=[],t=!0,e=document,s=function(t){n.forEach((function(n){return n.classList.remove(o)})),t.forEach((function(n){return n.classList.add(o)})),n=t},i=function(){t=!1,s([])};e.addEventListener("keydown",(function(n){(t=c.includes(n.key))||s([])})),e.addEventListener("focusin",(function(n){if(t&&n.composedPath){var e=n.composedPath().filter((function(n){return!!n.classList&&n.classList.contains("ion-focusable")}));s(e)}})),e.addEventListener("focusout",(function(){e.activeElement===e.body&&s([])})),e.addEventListener("touchstart",i),e.addEventListener("mousedown",i)}}}]);
//# sourceMappingURL=41.31727178.chunk.js.map
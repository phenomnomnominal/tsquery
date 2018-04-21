export const conditional = `

if (x === 1) {
    foo();
} else {
    x = 2;
}
if (x == 'test' && true || x) {
    y = -1;
} else if (false) {
    y = 1;
}

`;

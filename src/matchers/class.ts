export function classs (): boolean {
    // tslint:disable:no-console
    console.log('TODO: class selector 😎');
    return false;
}

// case 'class':
//     if(!node.type) return false;
//     switch(selector.name.toLowerCase()){
//         case 'statement':
//             if(node.type.slice(-9) === 'Statement') return true;
//             // fallthrough: interface Declaration <: Statement { }
//         case 'declaration':
//             return node.type.slice(-11) === 'Declaration';
//         case 'pattern':
//             if(node.type.slice(-7) === 'Pattern') return true;
//             // fallthrough: interface Expression <: Node, Pattern { }
//         case 'expression':
//             return node.type.slice(-10) === 'Expression' ||
//                 node.type.slice(-7) === 'Literal' ||
//                 (
//                     node.type === 'Identifier' &&
//                     (ancestry.length === 0 || ancestry[0].type !== 'MetaProperty')
//                 ) ||
//                 node.type === 'MetaProperty';
//         case 'function':
//             return node.type.slice(0, 8) === 'Function' ||
//                 node.type === 'ArrowFunctionExpression';
//     }
//     throw new Error('Unknown class name: ' + selector.name);
// }

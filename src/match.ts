// Dependencies:
import { Node, SourceFile } from 'typescript';
import { MATCHERS } from './matchers';
import { traverse } from './traverse';
import { TSQueryNode, TSQuerySelectorNode } from './tsquery-types';

export function match<T extends Node = Node> (ast: SourceFile, selector: TSQuerySelectorNode): Array<TSQueryNode<T>> {
    const ancestry: Array<TSQueryNode<T>> = [];
    const results: Array<TSQueryNode<T>> = [];
    if (!selector) {
        return results;
    }

    const altSubjects = subjects(selector);
    traverse(ast, {
        enter (node: TSQueryNode<T>, parent: TSQueryNode<T> | null): void {
            if (parent != null) {
                ancestry.unshift(parent);
            }
            if (findMatches(node, selector, ancestry)) {
                if (altSubjects.length) {
                    altSubjects.forEach(subject => {
                        if (findMatches(node, subject, ancestry)) {
                            results.push(node);
                        }
                        ancestry.forEach((ancestor, index) => {
                            if (findMatches(ancestor, subject, ancestry.slice(index + 1))) {
                                results.push(ancestor);
                            }
                        });
                    });
                } else {
                    results.push(node);
                }
            }
        },
        leave (): void {
            ancestry.shift();
        }
    });
    return results;
}

export function findMatches<T extends Node = Node> (node: TSQueryNode<T>, selector: TSQuerySelectorNode, ancestry: Array<TSQueryNode<T>> = []): boolean {
    if (!selector) {
        return true;
    }
    if (!node) {
        return false;
    }

    const matcher = MATCHERS[selector.type];
    if (matcher) {
        return matcher(node, selector, ancestry);
    }

    throw new Error(`Unknown selector type: ${selector.type}`);
}

function subjects<T extends Node> (selector?: TSQuerySelectorNode, ancestor?: TSQueryNode<T> | TSQuerySelectorNode): Array<any> {
    if (selector == null || typeof selector !== 'object') {
        return [];
    }

    if (ancestor == null) {
        ancestor = selector;
    }

    let results = selector.subject ? [ancestor] : [];
    Object.keys(selector).forEach(key => {
        results = results.concat(subjects(selector[key] as TSQuerySelectorNode, key === 'left' ? selector[key] as TSQueryNode | TSQuerySelectorNode : ancestor));
    });
    return results;
}

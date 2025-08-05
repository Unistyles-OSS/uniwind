import type { NodePath, PluginObj, types as t } from '@babel/core'
import type { ImportDeclaration, ImportSpecifier } from '@babel/types'
import { name } from '../../package.json'

const DEFAULT_RN_COMPONENTS = [
    'ActivityIndicator',
    'View',
    'Text',
    'Image',
    'ImageBackground',
    'KeyboardAvoidingView',
    'Pressable',
    'ScrollView',
    'FlatList',
    'SectionList',
    'Switch',
    'TextInput',
    'RefreshControl',
    'TouchableHighlight',
    'TouchableOpacity',
    'VirtualizedList',
    'Animated',
    'Modal',
    'TouchableWithoutFeedback',
]

export default ({ types }: { types: typeof t }): PluginObj => {
    const componentModule = `${name}/components`
    const RN_COMPONENTS = new Set(DEFAULT_RN_COMPONENTS)

    return {
        name,
        visitor: {
            ImportDeclaration: (path: NodePath<ImportDeclaration>) => {
                const { node } = path

                if (node.source.value !== 'react-native') {
                    return
                }

                const hasSomeComponent = node.specifiers.some(spec =>
                    types.isImportSpecifier(spec)
                    && types.isIdentifier(spec.imported)
                    && DEFAULT_RN_COMPONENTS.includes(spec.imported.name)
                )

                if (!hasSomeComponent) {
                    return
                }

                const componentSpecifiers: Array<ImportSpecifier> = []
                const nonComponentSpecifiers: Array<
                    | t.ImportSpecifier
                    | t.ImportDefaultSpecifier
                    | t.ImportNamespaceSpecifier
                > = []

                node.specifiers.forEach((specifier) => {
                    if (types.isImportSpecifier(specifier)) {
                        // @ts-expect-error TODO: Guard
                        const importedName = specifier.imported.name

                        if (RN_COMPONENTS.has(importedName)) {
                            componentSpecifiers.push(specifier)
                        } else {
                            nonComponentSpecifiers.push(specifier)
                        }
                    } else if (types.isImportDefaultSpecifier(specifier)) {
                        nonComponentSpecifiers.push(specifier)
                    } else if (types.isImportNamespaceSpecifier(specifier)) {
                        nonComponentSpecifiers.push(specifier)
                    }
                })

                const newImports: Array<ImportDeclaration> = []

                if (componentSpecifiers.length > 0) {
                    const componentImport = types.importDeclaration(
                        componentSpecifiers,
                        types.stringLiteral(componentModule),
                    )
                    newImports.push(componentImport)
                }

                if (nonComponentSpecifiers.length > 0) {
                    const nonComponentImport = types.importDeclaration(
                        nonComponentSpecifiers.map(s => types.cloneNode(s)),
                        types.stringLiteral('react-native'),
                    )
                    newImports.push(nonComponentImport)
                }

                if (newImports.length > 0) {
                    path.replaceWithMultiple(newImports)
                } else {
                    path.remove()
                }
            },
        },
    }
}

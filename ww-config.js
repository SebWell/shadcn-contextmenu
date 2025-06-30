export default {
  editor: {
    label: {
      en: 'Context Menu',
      fr: 'Menu Contextuel'
    },
    icon: 'more-vertical'
  },
  triggerEvents: [
    {
      name: 'item-click',
      label: { en: 'On item click', fr: 'Au clic sur élément' },
      event: {
        item: {},
        index: 0,
        subIndex: null,
        path: []
      }
    },
    {
      name: 'open',
      label: { en: 'On open', fr: 'À l\'ouverture' },
      event: {
        x: 0,
        y: 0
      }
    },
    {
      name: 'close',
      label: { en: 'On close', fr: 'À la fermeture' },
      event: {}
    }
  ],
  properties: {
    triggerText: {
      label: { en: 'Trigger text', fr: 'Texte de déclenchement' },
      type: 'Text',
      defaultValue: 'Right click here',
      bindable: true
    },
    items: {
      label: { en: 'Menu items', fr: 'Éléments du menu' },
      type: 'Array',
      options: {
        item: {
          type: 'Object',
          options: {
            item: {
              id: {
                label: { en: 'ID', fr: 'ID' },
                type: 'Text',
                bindable: true
              },
              label: {
                label: { en: 'Label', fr: 'Libellé' },
                type: 'Text',
                bindable: true
              },
              icon: {
                label: { en: 'Icon', fr: 'Icône' },
                type: 'Icon',
                bindable: true
              },
              type: {
                label: { en: 'Type', fr: 'Type' },
                type: 'TextSelect',
                options: {
                  options: [
                    { value: 'item', label: { en: 'Item', fr: 'Élément' } },
                    { value: 'checkbox', label: { en: 'Checkbox', fr: 'Case à cocher' } },
                    { value: 'separator', label: { en: 'Separator', fr: 'Séparateur' } }
                  ]
                },
                defaultValue: 'item',
                bindable: true
              },
              checked: {
                label: { en: 'Checked', fr: 'Coché' },
                type: 'OnOff',
                defaultValue: false,
                bindable: true
              },
              disabled: {
                label: { en: 'Disabled', fr: 'Désactivé' },
                type: 'OnOff',
                defaultValue: false,
                bindable: true
              },
              shortcut: {
                label: { en: 'Shortcut', fr: 'Raccourci' },
                type: 'Text',
                bindable: true
              },
              items: {
                label: { en: 'Sub-items', fr: 'Sous-éléments' },
                type: 'Array',
                options: {
                  item: {
                    type: 'Object',
                    options: {
                      item: {
                        id: {
                          label: { en: 'ID', fr: 'ID' },
                          type: 'Text',
                          bindable: true
                        },
                        label: {
                          label: { en: 'Label', fr: 'Libellé' },
                          type: 'Text',
                          bindable: true
                        },
                        icon: {
                          label: { en: 'Icon', fr: 'Icône' },
                          type: 'Icon',
                          bindable: true
                        },
                        type: {
                          label: { en: 'Type', fr: 'Type' },
                          type: 'TextSelect',
                          options: {
                            options: [
                              { value: 'item', label: { en: 'Item', fr: 'Élément' } },
                              { value: 'checkbox', label: { en: 'Checkbox', fr: 'Case à cocher' } }
                            ]
                          },
                          defaultValue: 'item',
                          bindable: true
                        },
                        checked: {
                          label: { en: 'Checked', fr: 'Coché' },
                          type: 'OnOff',
                          defaultValue: false,
                          bindable: true
                        },
                        disabled: {
                          label: { en: 'Disabled', fr: 'Désactivé' },
                          type: 'OnOff',
                          defaultValue: false,
                          bindable: true
                        },
                        shortcut: {
                          label: { en: 'Shortcut', fr: 'Raccourci' },
                          type: 'Text',
                          bindable: true
                        }
                      }
                    }
                  }
                },
                bindable: true
              }
            }
          }
        }
      },
      defaultValue: [
        {
          id: 'copy',
          label: 'Copy',
          icon: 'copy',
          shortcut: '⌘C'
        },
        {
          id: 'paste',
          label: 'Paste',
          icon: 'clipboard',
          shortcut: '⌘V'
        },
        {
          type: 'separator'
        },
        {
          id: 'edit',
          label: 'Edit',
          icon: 'edit',
          items: [
            {
              id: 'rename',
              label: 'Rename',
              icon: 'edit-3',
              shortcut: 'F2'
            },
            {
              id: 'duplicate',
              label: 'Duplicate',
              icon: 'copy'
            }
          ]
        },
        {
          type: 'separator'
        },
        {
          id: 'delete',
          label: 'Delete',
          icon: 'trash',
          shortcut: '⌫'
        }
      ],
      bindable: true
    },
    customClass: {
      label: { en: 'Custom CSS class', fr: 'Classe CSS personnalisée' },
      type: 'Text',
      bindable: true
    },
    customStyle: {
      label: { en: 'Custom style', fr: 'Style personnalisé' },
      type: 'Text',
      bindable: true
    }
  }
} 
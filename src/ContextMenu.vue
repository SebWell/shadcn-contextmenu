<template>
  <div ref="triggerRef" @contextmenu="handleRightClick" :class="content.customClass" :style="content.customStyle">
    <slot>
      <div class="w-full h-full">
        {{ content.triggerText || 'Right click here' }}
      </div>
    </slot>

    <!-- Context Menu -->
    <teleport to="body">
      <div
        v-if="isOpen"
        ref="menuRef"
        :class="cn(
          'fixed z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
          'fade-in-0 zoom-in-95'
        )"
        :style="menuStyle"
        @keydown="handleKeyDown"
        tabindex="0"
        role="menu"
        @blur="handleBlur"
      >
        <div
          v-for="(item, index) in content.items"
          :key="item.id || index"
          :class="cn(
            item.type === 'separator' ? 'my-1 h-px bg-muted' : ''
          )"
        >
          <!-- Separator -->
          <div v-if="item.type === 'separator'" role="separator" />
          
          <!-- Sub-menu item -->
          <div
            v-else-if="item.items && item.items.length > 0"
            class="relative"
            @mouseenter="handleSubMenuEnter(index)"
            @mouseleave="handleSubMenuLeave"
          >
            <button
              :class="cn(
                'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                selectedIndex === index ? 'bg-accent text-accent-foreground' : '',
                item.disabled ? 'pointer-events-none opacity-50' : ''
              )"
              @click="handleItemClick(item, index)"
              :disabled="item.disabled"
              role="menuitem"
              :aria-haspopup="true"
              :aria-expanded="activeSubMenuIndex === index"
            >
              <component
                v-if="item.icon"
                :is="item.icon"
                class="mr-2 h-4 w-4"
              />
              <span class="flex-1">{{ item.label }}</span>
              <span v-if="item.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
                {{ item.shortcut }}
              </span>
              <svg class="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- Sub-menu -->
            <div
              v-if="activeSubMenuIndex === index"
              :class="cn(
                'absolute left-full top-0 z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md animate-in data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
                'ml-1'
              )"
              role="menu"
            >
              <button
                v-for="(subItem, subIndex) in item.items"
                :key="subItem.id || subIndex"
                :class="cn(
                  'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
                  'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  subItem.disabled ? 'pointer-events-none opacity-50' : ''
                )"
                @click="handleItemClick(subItem, index, subIndex)"
                :disabled="subItem.disabled"
                role="menuitem"
              >
                <component
                  v-if="subItem.icon"
                  :is="subItem.icon"
                  class="mr-2 h-4 w-4"
                />
                <span class="flex-1">{{ subItem.label }}</span>
                <span v-if="subItem.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
                  {{ subItem.shortcut }}
                </span>
                <svg
                  v-if="subItem.type === 'checkbox' && subItem.checked"
                  class="ml-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- Regular menu item -->
          <button
            v-else
            :class="cn(
              'relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors',
              'hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
              selectedIndex === index ? 'bg-accent text-accent-foreground' : '',
              item.disabled ? 'pointer-events-none opacity-50' : ''
            )"
            @click="handleItemClick(item, index)"
            :disabled="item.disabled"
            role="menuitem"
            :aria-checked="item.type === 'checkbox' ? item.checked : undefined"
          >
            <component
              v-if="item.icon"
              :is="item.icon"
              class="mr-2 h-4 w-4"
            />
            <span class="flex-1">{{ item.label }}</span>
            <span v-if="item.shortcut" class="ml-auto text-xs tracking-widest opacity-60">
              {{ item.shortcut }}
            </span>
            <svg
              v-if="item.type === 'checkbox' && item.checked"
              class="ml-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <polyline points="20,6 9,17 4,12" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"/>
            </svg>
          </button>
        </div>
      </div>
    </teleport>
  </div>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount, nextTick } from 'vue'

export default {
  props: {
    content: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['item-click', 'open', 'close'],
  setup(props, { emit }) {
    // Import utility function
    const cn = (...inputs) => {
      return inputs.filter(Boolean).join(' ')
    }

    const triggerRef = ref(null)
    const menuRef = ref(null)
    const isOpen = ref(false)
    const selectedIndex = ref(0)
    const activeSubMenuIndex = ref(-1)
    const menuPosition = ref({ x: 0, y: 0 })

    const menuStyle = computed(() => ({
      left: `${menuPosition.value.x}px`,
      top: `${menuPosition.value.y}px`
    }))

    const handleRightClick = (event) => {
      event.preventDefault()
      
      if (isOpen.value) {
        closeMenu()
        return
      }

      // Calculate menu position
      const x = event.clientX
      const y = event.clientY
      
      // Ensure menu doesn't go off screen
      nextTick(() => {
        if (menuRef.value) {
          const menuRect = menuRef.value.getBoundingClientRect()
          const viewportWidth = window.innerWidth
          const viewportHeight = window.innerHeight
          
          let adjustedX = x
          let adjustedY = y
          
          // Adjust horizontal position
          if (x + menuRect.width > viewportWidth) {
            adjustedX = viewportWidth - menuRect.width - 10
          }
          
          // Adjust vertical position
          if (y + menuRect.height > viewportHeight) {
            adjustedY = viewportHeight - menuRect.height - 10
          }
          
          menuPosition.value = { x: adjustedX, y: adjustedY }
        }
      })
      
      menuPosition.value = { x, y }
      isOpen.value = true
      selectedIndex.value = 0
      activeSubMenuIndex.value = -1
      
      emit('open', { x, y })
      
      // Focus menu for keyboard navigation
      nextTick(() => {
        menuRef.value?.focus()
      })
    }

    const closeMenu = () => {
      isOpen.value = false
      activeSubMenuIndex.value = -1
      emit('close')
    }

    const handleItemClick = (item, index, subIndex = null) => {
      if (item.disabled) return

      // Handle checkbox items
      if (item.type === 'checkbox') {
        item.checked = !item.checked
      }

      emit('item-click', {
        item,
        index,
        subIndex,
        path: subIndex !== null ? [index, subIndex] : [index]
      })

      // Close menu after action (unless it's a checkbox)
      if (item.type !== 'checkbox' && !item.items) {
        closeMenu()
      }
    }

    const handleSubMenuEnter = (index) => {
      activeSubMenuIndex.value = index
    }

    const handleSubMenuLeave = () => {
      setTimeout(() => {
        activeSubMenuIndex.value = -1
      }, 100)
    }

    const handleKeyDown = (event) => {
      const validItems = props.content.items?.filter(item => item.type !== 'separator') || []
      
      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault()
          selectedIndex.value = Math.min(selectedIndex.value + 1, validItems.length - 1)
          break
        case 'ArrowUp':
          event.preventDefault()
          selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
          break
        case 'ArrowRight':
          event.preventDefault()
          const currentItem = validItems[selectedIndex.value]
          if (currentItem?.items && currentItem.items.length > 0) {
            activeSubMenuIndex.value = selectedIndex.value
          }
          break
        case 'ArrowLeft':
          event.preventDefault()
          activeSubMenuIndex.value = -1
          break
        case 'Enter':
        case ' ':
          event.preventDefault()
          if (validItems[selectedIndex.value]) {
            handleItemClick(validItems[selectedIndex.value], selectedIndex.value)
          }
          break
        case 'Escape':
          event.preventDefault()
          closeMenu()
          break
      }
    }

    const handleBlur = (event) => {
      // Only close if focus is not moving to a submenu
      if (!event.relatedTarget?.closest('[role="menu"]')) {
        setTimeout(closeMenu, 100)
      }
    }

    const handleClickOutside = (event) => {
      if (isOpen.value && 
          !menuRef.value?.contains(event.target) && 
          !triggerRef.value?.contains(event.target)) {
        closeMenu()
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
      document.addEventListener('contextmenu', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
      document.removeEventListener('contextmenu', handleClickOutside)
    })

    return {
      cn,
      triggerRef,
      menuRef,
      isOpen,
      selectedIndex,
      activeSubMenuIndex,
      menuStyle,
      handleRightClick,
      closeMenu,
      handleItemClick,
      handleSubMenuEnter,
      handleSubMenuLeave,
      handleKeyDown,
      handleBlur
    }
  }
}
</script>

<style>
/* Import global shadcn/ui styles */
@import './globals.css';
</style> 
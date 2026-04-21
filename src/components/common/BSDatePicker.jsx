import React, { useEffect, useMemo, useRef } from 'react';
import { Box, FormControl, FormHelperText, InputLabel } from '@mui/material';
import { NepaliDatePicker } from 'nepali-datepicker-reactjs';
import 'nepali-datepicker-reactjs/dist/index.css';
import { adToBSDate, normalizeBSDate } from '../../utils/nepaliDate';

/**
 * BSDatePicker
 * ------------
 * Drop-in replacement for `<TextField type="date">` (or `<input type="date">`)
 * that keeps the underlying form state in Bikram Sambat (`YYYY-MM-DD`).
 *
 * For backward safety, it also accepts incoming AD dates and normalizes them
 * to BS on render, but it always emits BS strings on change.
 *
 * Props mirror the MUI TextField subset we actually use across the app.
 *
 * @param {string}   props.label         Visible label (rendered above the picker)
 * @param {string}   props.name          Form field name
 * @param {string}   props.value         BS date string (`YYYY-MM-DD`) — the app's source of truth
 * @param {Function} props.onChange      Receives a synthetic { target: { name, value } } event
 * @param {boolean}  props.required
 * @param {boolean}  props.disabled
 * @param {string}   props.error         Error message (presence also toggles error styling)
 * @param {string}   props.helperText
 * @param {boolean}  props.fullWidth     Defaults true
 * @param {'small'|'medium'} props.size  Defaults 'medium'
 * @param {number}   props.minYear       BS min year (defaults 2000 ≈ 1943 AD)
 * @param {number}   props.maxYear       BS max year (defaults 2099 ≈ 2042 AD)
 */
const BSDatePicker = ({
  label,
  name,
  value,
  onChange,
  required = false,
  disabled = false,
  error = '',
  helperText,
  fullWidth = true,
  size = 'medium',
  minYear = 2000,
  maxYear = 2099,
  options,
  sx,
}) => {
  const bsValue = useMemo(() => normalizeBSDate(value) || adToBSDate(value), [value]);
  const hasError = Boolean(error);
  const isSmall = size === 'small';
  const pickerHostRef = useRef(null);

  const handleChange = (newBs) => {
    onChange?.({ target: { name, value: normalizeBSDate(newBs), type: 'text' } });
  };

  useEffect(() => {
    const host = pickerHostRef.current;
    if (!host || typeof window === 'undefined') {
      return undefined;
    }

    let frameId = 0;
    let listenersBound = false;
    let resizeObserver = null;
    let observedCalendar = null;

    const getElements = () => {
      const picker = host.querySelector('.nepali-date-picker');
      const input = picker?.querySelector('input');
      const calendar = picker?.querySelector('.calender');
      return { picker, input, calendar };
    };

    const updateCalendarPosition = () => {
      cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(() => {
        const { input, calendar } = getElements();
        if (!input || !calendar) {
          return;
        }

        const inputRect = input.getBoundingClientRect();
        const calendarRect = calendar.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const margin = 8;
        const gap = 4;

        let top = inputRect.bottom + gap;
        let left = inputRect.left;
        let transformOrigin = 'top left';

        if (left + calendarRect.width > viewportWidth - margin) {
          left = Math.max(margin, viewportWidth - calendarRect.width - margin);
        }

        if (top + calendarRect.height > viewportHeight - margin) {
          const aboveTop = inputRect.top - calendarRect.height - gap;
          if (aboveTop >= margin) {
            top = aboveTop;
            transformOrigin = 'bottom left';
          } else {
            top = Math.max(margin, viewportHeight - calendarRect.height - margin);
          }
        }

        calendar.style.position = 'fixed';
        calendar.style.top = `${Math.max(margin, top)}px`;
        calendar.style.left = `${Math.max(margin, left)}px`;
        calendar.style.right = 'auto';
        calendar.style.bottom = 'auto';
        calendar.style.margin = '0';
        calendar.style.zIndex = '1700';
        calendar.style.transformOrigin = transformOrigin;
      });
    };

    const syncListeners = () => {
      const { calendar } = getElements();
      if (calendar && !listenersBound) {
        window.addEventListener('resize', updateCalendarPosition);
        window.addEventListener('scroll', updateCalendarPosition, true);
        listenersBound = true;
      } else if (!calendar && listenersBound) {
        window.removeEventListener('resize', updateCalendarPosition);
        window.removeEventListener('scroll', updateCalendarPosition, true);
        listenersBound = false;
      }

      if (calendar !== observedCalendar) {
        resizeObserver?.disconnect();
        observedCalendar = calendar || null;

        if (calendar && typeof ResizeObserver !== 'undefined') {
          resizeObserver = new ResizeObserver(() => {
            updateCalendarPosition();
          });
          resizeObserver.observe(calendar);
        } else {
          resizeObserver = null;
        }
      }
    };

    const observer = new MutationObserver(() => {
      syncListeners();
      updateCalendarPosition();
    });

    observer.observe(host, {
      childList: true,
      subtree: true,
    });

    syncListeners();
    updateCalendarPosition();

    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      resizeObserver?.disconnect();
      if (listenersBound) {
        window.removeEventListener('resize', updateCalendarPosition);
        window.removeEventListener('scroll', updateCalendarPosition, true);
      }
    };
  }, []);

  return (
    <FormControl
      fullWidth={fullWidth}
      error={hasError}
      disabled={disabled}
      required={required}
      size={size}
      sx={sx}
    >
      {label && (
        <InputLabel
          shrink
          sx={{
            position: 'static',
            transform: 'none',
            mb: 0.5,
            fontSize: '0.75rem',
            lineHeight: 1.4,
            color: hasError ? 'error.main' : 'text.secondary',
            pointerEvents: 'none',
          }}
        >
          {label}
          {required ? ' *' : ''}
        </InputLabel>
      )}

      <Box
        ref={pickerHostRef}
        sx={{
          width: '100%',
          overflow: 'visible',
          '& .nepali-date-picker': {
            width: '100%',
            overflow: 'visible',
          },
          '& .nepali-date-picker input': {
            width: '100%',
            boxSizing: 'border-box',
            padding: isSmall ? '8.5px 14px' : '14px 14px',
            fontSize: '1rem',
            fontFamily: 'inherit',
            lineHeight: 1.4375,
            color: disabled ? 'rgba(0,0,0,0.38)' : 'rgba(0,0,0,0.87)',
            backgroundColor: disabled ? 'rgba(0,0,0,0.04)' : 'transparent',
            border: '1px solid',
            borderColor: hasError ? '#d32f2f' : 'rgba(0,0,0,0.23)',
            borderRadius: '4px',
            outline: 'none',
            transition: 'border-color 150ms ease, box-shadow 150ms ease',
            cursor: disabled ? 'not-allowed' : 'pointer',
          },
          '& .nepali-date-picker input:hover': {
            borderColor: hasError ? '#d32f2f' : 'rgba(0,0,0,0.87)',
          },
          '& .nepali-date-picker input:focus': {
            borderColor: hasError ? '#d32f2f' : '#1976d2',
            boxShadow: hasError ? 'none' : '0 0 0 1px #1976d2',
          },
          '& .nepali-date-picker .calender': {
            zIndex: 1700, // sit above MUI Dialogs (1300)
            maxWidth: 'calc(100vw - 16px)',
          },
        }}
      >
        <NepaliDatePicker
          value={bsValue}
          onChange={handleChange}
          minYear={minYear}
          maxYear={maxYear}
          options={{
            closeOnSelect: true,
            calenderLocale: 'en',
            valueLocale: 'en',
            ...(options || {}),
          }}
        />
      </Box>

      {(error || helperText) && (
        <FormHelperText>{error || helperText}</FormHelperText>
      )}
    </FormControl>
  );
};

export default BSDatePicker;

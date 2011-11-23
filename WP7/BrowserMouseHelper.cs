using System.Linq;
using System.Windows;
using System.Windows.Controls;
using Microsoft.Phone.Controls;
using System.Windows.Input;
using System.Diagnostics;
using System.Windows.Media;
using System;

namespace WP7GapControlExtensions
{

    /// <summary>
    /// Suppresses pinch zoom and optionally scrolling of the WebBrowser control
    /// </summary>
    public class BrowserMouseHelper
    {

        /**
        event.initMouseEvent(type, canBubble, cancelable, view,
        detail, screenX, screenY, clientX, clientY,
        ctrlKey, altKey, shiftKey, metaKey,
        button, relatedTarget);
         * 
         * Full Script below, in use it is minified.
        */

        /*
        private static string mouseScript = 
        @"function onNativeMouseEvent(type,x,y)
        {
            var xMod = screen.logicalXDPI / screen.deviceXDPI;
            var yMod = screen.logicalYDPI / screen.deviceYDPI;
            var evt = document.createEvent('MouseEvents');
            var xPos =  document.body.scrollLeft + Math.round(xMod * x);
            var yPos =  document.body.scrollTop + Math.round(yMod * y);
            var element = document.elementFromPoint(xPos,yPos);
            evt.initMouseEvent(type, true, true, window, 0, xPos, yPos, xPos, yPos, false, false, false, false, 0, element);
            var canceled = element ? !element.dispatchEvent(evt) : !document.dispatchEvent(evt);
            return canceled ? 'true' : 'false';
        }";
        */

        private static string MinifiedMouseScript = "function onNativeMouseEvent(e,a,b){var f=screen.logicalXDPI/screen.deviceXDPI,c=screen.logicalYDPI/screen.deviceYDPI,d=document.createEvent(\"MouseEvents\"),a=document.body.scrollLeft+Math.round(f*a),b=document.body.scrollTop+Math.round(c*b),c=document.elementFromPoint(a,b);d.initMouseEvent(e,true,true,window,0,a,b,a,b,false,false,false,false,0,c);return(c?!c.dispatchEvent(d):!document.dispatchEvent(d))?\"true\":\"false\"};";

        private WebBrowser _browser;

        /// <summary>
        /// Gets or sets whether to suppress the scrolling of
        /// the WebBrowser control;
        /// </summary>
        public bool ScrollDisabled { get; set; }
        public bool ZoomDisabled { get; set; }
        protected Border border;

        public BrowserMouseHelper(WebBrowser browser)
        {
            _browser = browser;
            if (true)//browser.Source != null)
            {
                var border0 = VisualTreeHelper.GetChild(_browser, 0);
                var border1 = VisualTreeHelper.GetChild(border0, 0);
                var panZoom = VisualTreeHelper.GetChild(border1, 0);
                var grid = VisualTreeHelper.GetChild(panZoom, 0);
                border = VisualTreeHelper.GetChild(grid, 0) as Border;


                if (border != null)
                {
                    border.ManipulationStarted += Border_ManipulationStarted;
                    border.ManipulationDelta += Border_ManipulationDelta;
                    border.ManipulationCompleted += Border_ManipulationCompleted;
                    border.DoubleTap += Border_DoubleTap;
                    border.Hold += Border_Hold;
                    border.MouseLeftButtonDown += Border_MouseLeftButtonDown;
                }

                try
                {
                    _browser.InvokeScript("execScript", MinifiedMouseScript);
                }
                catch (Exception)
                {
                    Debug.WriteLine("BrowserHelper Failed to install mouse script in WebBrowser");
                }
            }
            browser.Loaded += new RoutedEventHandler(browser_Loaded);
        }

        private void browser_Loaded(object sender, RoutedEventArgs e)
        {
            var border0 = VisualTreeHelper.GetChild(_browser, 0);
            var border1 = VisualTreeHelper.GetChild(border0, 0);
            var panZoom = VisualTreeHelper.GetChild(border1, 0);
            var grid = VisualTreeHelper.GetChild(panZoom, 0);
            border = VisualTreeHelper.GetChild(grid, 0) as Border;


            if (border != null)
            {
                border.ManipulationStarted += Border_ManipulationStarted;
                border.ManipulationDelta += Border_ManipulationDelta;
                border.ManipulationCompleted += Border_ManipulationCompleted;
                border.DoubleTap += Border_DoubleTap;
                border.Hold += Border_Hold;
                border.MouseLeftButtonDown += Border_MouseLeftButtonDown;
            }

            _browser.LoadCompleted += Browser_LoadCompleted;

        }

        void Browser_LoadCompleted(object sender, System.Windows.Navigation.NavigationEventArgs e)
        {
            try
            {
                _browser.InvokeScript("execScript", MinifiedMouseScript);
            }
            catch (Exception)
            {
                Debug.WriteLine("BrowserHelper Failed to install mouse script in WebBrowser");
            }

        }

        bool InvokeSimulatedMouseEvent(string eventName, Point pos)
        {
            bool bCancelled = false;
            try
            {
                string strCancelled = _browser.InvokeScript("onNativeMouseEvent", new string[] { eventName, pos.X.ToString(), pos.Y.ToString() }) as string;
                if (bool.TryParse(strCancelled, out bCancelled))
                {
                    return bCancelled;
                }

            }
            catch (Exception)
            {
                // script error
            }

            return bCancelled;
        }

        void Border_Hold(object sender, GestureEventArgs e)
        {
            //throw new System.NotImplementedException();
            e.Handled = true;
        }

        void Border_DoubleTap(object sender, GestureEventArgs e)
        {
            e.Handled = true;
        }

        void Border_ManipulationStarted(object sender, ManipulationStartedEventArgs e)
        {
            if (ScrollDisabled)
            {
                e.Complete();
            }
        }


        void Border_MouseLeftButtonDown(object sender, MouseButtonEventArgs e)
        {
            border.MouseMove += new MouseEventHandler(Border_MouseMove);
            border.MouseLeftButtonUp += new MouseButtonEventHandler(Border_MouseLeftButtonUp);

            Point pos = e.GetPosition(_browser);

            bool bCancelled = InvokeSimulatedMouseEvent("mousedown", pos);
            e.Handled = bCancelled;
            ScrollDisabled = bCancelled;
        }

        void Border_MouseLeftButtonUp(object sender, MouseButtonEventArgs e)
        {
            border.MouseMove -= new MouseEventHandler(Border_MouseMove);
            border.MouseLeftButtonUp -= new MouseButtonEventHandler(Border_MouseLeftButtonUp);
            Point pos = e.GetPosition(_browser);

            bool bCancelled = InvokeSimulatedMouseEvent("mouseup", pos);
            e.Handled = bCancelled;
            ScrollDisabled = false;
        }


        void Border_MouseMove(object sender, MouseEventArgs e)
        {
            Debug.WriteLine("Border_MouseMove");
            Point pos = e.GetPosition(_browser);

            bool bCancelled = InvokeSimulatedMouseEvent("mousemove", pos);
            ScrollDisabled = bCancelled;

        }

        private void Border_ManipulationCompleted(object sender, ManipulationCompletedEventArgs e)
        {
            // suppress zoom
            if (e.FinalVelocities != null)
            {
                if (e.FinalVelocities.ExpansionVelocity.X != 0.0 ||
                   e.FinalVelocities.ExpansionVelocity.Y != 0.0)
                {
                    e.Handled = true;
                }
            }
        }

        private void Border_ManipulationDelta(object sender, ManipulationDeltaEventArgs e)
        {
            // optionally suppress zoom
            if (ZoomDisabled && (e.DeltaManipulation.Scale.X != 0.0 || e.DeltaManipulation.Scale.Y != 0.0) )
            {
                e.Handled = true;
                e.Complete();
            }
            // optionally suppress scrolling
            if (ScrollDisabled && (e.DeltaManipulation.Translation.X != 0.0 || e.DeltaManipulation.Translation.Y != 0.0) )
            {
                e.Handled = true;
                e.Complete();
            }
        }

    }
}
